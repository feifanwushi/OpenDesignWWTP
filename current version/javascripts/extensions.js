//requestpara是js获取url的parameter的函数
function requestpara(paras)
    { 
        var url = location.href; 

        var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
        var paraObj = {} 
        for (i=0; j=paraString[i]; i++){ 
        paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
        } 
        var returnValue = paraObj[paras.toLowerCase()]; 
        if(typeof(returnValue)=="undefined"){ 
        return ""; 
        }else{ 
        return returnValue; 
        } 
    }
	
function getlang()
{	var lang=$.trim(requestpara('lang')) ;
	switch(lang){
		case "cn":	lang="cn";	break;
		case "en": lang="en"; break;
		default:lang="cn"; break;}
	return lang;
	}

function getjson(x)
{	$.ajaxSettings.async = false;
	$.ajaxSettings.cache = false;
	var result
	$.getJSON("json/"+x+".json",function(data){
		result=data;
		})
	return result;
	}
	
	
//UNIT DESIGN FUNCTION
function design_proc(y,c,inputs)//Y = CURRENT UNIT  P=DESIGN CODE
{	
	var tmp_var
	var tmp_design
	var tmp_civil
	var flag_interlock
	if (localStorage.getItem("design"))
	{
		tmp_design=JSON.parse(localStorage.getItem("design"))
		tmp_design[y]={}
		tmp_design[y]["design"]={}
		tmp_design[y]["design"][c]={"input":{},"result":{}}
		}
	else{
	
		tmp_design={}
		tmp_design["alias"]={}
		tmp_design["basic"]={}
		tmp_design["basic"]["design"]={}
		tmp_design["basic"]["design"][c]={"input":{}}
		tmp_design[y]={}
		tmp_design[y]["design"]={}
		tmp_design[y]["design"][c]={"input":{},"result":{}}
	}
	
	if (localStorage.getItem("civil"))
	{
		tmp_civil=JSON.parse(localStorage.getItem("civil"));
		tmp_civil[y]={};
		tmp_civil[y]["dimension"]={};
		tmp_civil[y]["dimension"][c]={};
	}
	else
	{
		tmp_civil={};
		tmp_civil[y]={};
		tmp_civil[y]["dimension"]={};
		tmp_civil[y]["dimension"][c]={};
	}
	
	//alert(JSON.stringify(tmp_design))
	
	//DECLARE INPUT VARS
	$.each(inputs,function(key){
		window[inputs[key]["name"]]=inputs[key]["value"]
		
			if (inputs[key]["name"] in design["basic"]["design"][c]["input"]) 
			{tmp_design["basic"]["design"][c]["input"][inputs[key]["name"]]=inputs[key]["value"]} 
			else
			{ if(inputs[key]["name"]!="submit" ){
			tmp_design[y]["design"][c]["input"][inputs[key]["name"]]=inputs[key]["value"]}}
		})
	
	
	//SHOW RESULTS
		
		tmp_html='<h1>计算结果</h1><table class="table table-hover">'
		//STORE LOCALSOTRAGE---BASIC
		/*$.each(design.basic.input,function(key){
			localStorage("basic_"+key,parseFloat(window[key]).toFixed(3))	
			})*/
		// OUTPUT INPUTS AND STORE AS COOKIES IN CASE OF ALIAS
		for(x in design[y]["design"][c]["input"]){
			//if(!isNaN(window[x])){window[x]=(parseFloat(window[x])).toFixed(3)};//CONVERT NUMBER TO FIXED DECIMAL 3
			//tmp_html+='<tr><td>'+design[y]["input"][x]["name"]+'</td><td>'+window[x]+'</td></tr>';
			
			
			
			if(typeof(tmp_var=design[y]["design"][c]["input"][x]["interlock"])!='undefined')
				{var radiovalues=design[y]["design"][c]["input"][tmp_var.substr(0,tmp_var.length-2)]["value"].split("|")					
					if (window[tmp_var.substr(0,tmp_var.length-2)] ==radiovalues[tmp_var.substr(tmp_var.length-1,tmp_var.length)])
					{tmp_html+='<tr><td>'+design[y]["design"][c]["input"][x]["name"]+'</td><td>'+window[x]+'</td></tr>'
					
					}
				}
				else
				{tmp_html+='<tr><td>'+design[y]["design"][c]["input"][x]["name"]+'</td><td>'+window[x]+'</td></tr>'}
			
					
			
		}		
		
		//STORE COOKIES--RESULTS AND OUTPUT RESULTS
		for(x in design[y]["design"][c]["result"]){
			//CALCULATE RESULT BASED ON GIVEN EQUATION
			tmp=parseFloat(eval(design[y]["design"][c]["result"][x]["calc"])).toFixed(3)
			
			
			//IN CASE OF ALIAS, STORE EXTRA ALIAS ITEM
			//if(design[y]["design"][c]["result"][x]["alias"]){
				//tmp_design["alias"][design[y]["design"][c]["result"][x]["alias"]]=tmp;}
			
			
			//IN CASE OF INTERLOCK
			
			if(tmp_var=design[y]["design"][c]["result"][x]["interlock"])
			{	var radiovalues=design[y]["design"][c]["input"][tmp_var.substr(0,tmp_var.length-2)]["value"].split("|")			//TRUE INTERLOCK		
				if (window[tmp_var.substr(0,tmp_var.length-2)] ==radiovalues[tmp_var.substr(tmp_var.length-1,tmp_var.length)])
				{flag_interlock=true;} else{flag_interlock=false};
				}
			else
			{flag_interlock=true}
			
			if(flag_interlock){
				//TMP_HTML TO SHOW RESULT
				tmp_html+='<tr><td>'+design[y]["design"][c]["result"][x]["name"]+'</td><td>'+tmp+'</td></tr>'
				//PREPARE RESULT DATA FOR LOCALSTORAGE
				tmp_design[y]["design"][c]["result"][x]=tmp;
				// IN CASE OF ALIAS, THEN STORE ALIAS ITERM
				if(design[y]["design"][c]["result"][x]["alias"]){
				tmp_design["alias"][design[y]["design"][c]["result"][x]["alias"]]=tmp;}
				// IN CASE OF DIMENSION, THEN STORE DIMENSION ITEM
					switch(design[y]["design"][c]["result"][x]["dimension"])
					{case "L":
						tmp_civil[y]["dimension"][c]["L"]=tmp
					break;
					case "B":
						tmp_civil[y]["dimension"][c]["B"]=tmp
					break;
					case "LB":
						tmp_civil[y]["dimension"][c]["L"]=tmp
						tmp_civil[y]["dimension"][c]["B"]=tmp
					break;
					case "D":
						tmp_civil[y]["dimension"][c]["D"]=tmp
					break;
					case "H":
						tmp_civil[y]["dimension"][c]["H"]=tmp
					break;
					default:
					break;
					}
			}
			
			
			
			
			
		/*	if(tmp_var=design[y]["design"][c]["result"][x]["interlock"])
				//HAS INTERLOCK
				{	var radiovalues=design[y]["design"][c]["input"][tmp_var.substr(0,tmp_var.length-2)]["value"].split("|")			//INTERCLOCK TRUE 		
					if (window[tmp_var.substr(0,tmp_var.length-2)] ==radiovalues[tmp_var.substr(tmp_var.length-1,tmp_var.length)])
					{tmp_html+='<tr><td>'+design[y]["design"][c]["result"][x]["name"]+'</td><td>'+tmp+'</td></tr>'
					tmp_design[y]["design"][c]["result"][x]=tmp;
					
					
					
					
					}
				}
				else
				//NO INTERLOCK
				{tmp_html+='<tr><td>'+design[y]["design"][c]["result"][x]["name"]+'</td><td>'+tmp+'</td></tr>'
				tmp_design[y]["design"][c]["result"][x]=tmp;}

			
			//IF DIMENSION THEN LOCALSTORE IN CIVIL
			switch(design[y]["design"][c]["result"][x]["dimension"])
			{case "L":
				tmp_civil[y]["dimension"][c]["L"]=tmp
			break;
			case "B":
				tmp_civil[y]["dimension"][c]["B"]=tmp
			break;
			case "LB":
				tmp_civil[y]["dimension"][c]["L"]=tmp
				tmp_civil[y]["dimension"][c]["B"]=tmp
			break;
			case "D":
				tmp_civil[y]["dimension"][c]["D"]=tmp
			break;
			case "H":
				tmp_civil[y]["dimension"][c]["H"]=tmp
			break;
			default:
			break;
			}*/
			
		/*	if()
			{ 
			design[y]["design"][c]["result"][x]["dimension"])
				
				tmp_design[y]["design"][c]["dimension"][d]=tmp;}
				*/
				
				
		}
		tmp_html+='</table>'
		$("#div_result").html(tmp_html)
		$("#div_result").show();
		
		localStorage.setItem("design",JSON.stringify(tmp_design))
		localStorage.setItem("civil",JSON.stringify(tmp_civil))
		//alert(localStorage.design)
		//alert(localStorage.civil)
		
		
		
}
function buildpage()
{	
	//ADD DIVS---DIV_HEADER,DIV_CENTER,DIV_FOOTER
	tmp_html='<div id="div_header" ><div id="div_logo">OpenDesignWWTP</div><div id="div_nav"></div></div>\
<div id="div_center" class="container-fluid"></div>\
<div id="div_footer" class="footer"></div>'
	$("body").append(tmp_html);
	//HEADER
	tmp_html='<nav class="navbar navbar-default" role="navigation"><div class="navbar-header"><button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#nav_opendesignwwtp"> <span class="sr-only">Switch</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="index.html">OpenDesignWWTP</a></div><div class="collapse navbar-collapse" id="nav_opendesignwwtp"><ul class="nav navbar-nav"><li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">'+label.units+' <span class="caret"></span></a><ul class="dropdown-menu" role="menu"></ul></li>';	
	
	
	$.each(label.header,function(key){
	tmp_html+='<li><a href='+label.header[key]["value"]+'>'+label.header[key]["name"]+'</a></li>'
		})
	tmp_html+='</ul><ul class="nav navbar-nav navbar-right"><li><a to_lang="cn" href="javascript:void(0)">中文</a></li><li><a  href="javascript:void(0)" to_lang="en">English</a></li></ul></div></nav>'
	$("#div_header").html(tmp_html)
	//FOOTER
	tmp_html='<div class="container"><p class="text-center">'+label.footer+'</p></div>'
	$('#div_footer').html(tmp_html);
	}
	
	
	
