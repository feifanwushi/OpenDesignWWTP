#This file is part of OpenDesignWWTP
#OpenDesignWWTP is an open-source web-based application for wastewater treatment plant design
#Homepage http://opendesignwwtp.heyang.xyz
#Source code and documentation https://github.com/he-yang/opendesignwwtp
#released under MIT license, see the license file
#Copyright(C) 2014 He Yang

#FuncDesignger and openopt are used as Global problem 'solver', see documentation at www.openopt.org
from FuncDesigner import *
from openopt import GLP
import json
#Bottle is a well-known python based web programming framework
from bottle import Bottle,run,request,post,debug

#Bottle 
app = Bottle()
debug(True)

@app.route('/')
def hello():
    return format("Optimization solver for OpenDesignWWTP, see http://opendesignwwtp.heyang.xyz")


@app.route('/', method = 'POST')
@app.route('/w')
#OpenDesignWWTP optimization process start HERE
def optimize():
    #json = request.json
    #Words may bring risks to server are prohibited
    illegalwords=["import","os.","delete",'sys.','sae']
    flag=True
    found_iw=''
    #Obtain string from Client, filetype JSON
    ostr=request.json#{"str":"x=oovar('x');y=oovar('y');f=x*y;startpoint={x:0,y:0};constraints=[x>=0,x<=5,y>=0,y<=5,x+y==5]"}
    #Illegal words filter
    for iw in illegalwords:
        if iw in ostr['str']:flag=False;found_iw+=','+iw
    #Run optimization         
    if flag==True:#No illegal words found
        exec ostr['str']
        p=GLP(f,startpoint,constraints=constraints)
        r=p.minimize('interalg')
        if r.stopcase==1:#results found
            rstr={}
            for i in r.xf:
                rstr[str(i)]=str('%0.3f' % r.xf[i])
            rstr['f']=str('%0.3f' % r.ff)
            return str(rstr)
        else:#results not found
            return 'OpenOpt Solver response: '+r.msg
    else:#Illegal words found
        return 'OpenDesignWWTP response:Illegal words ['+found_iw+'] found'
#The last line may vary depends on the server, consult server administrator for more information.
application = sae.create_wsgi_app(app)
