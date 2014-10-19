// JavaScript Document
//AFTER. JS CONTAINS JAVASCRIPTS FOR DOM MANIPULATION AFTER REAL PAGE READY
$(document).ready(function(){
	//LOAD ALERTS
	if(!window.sessionStorage.close_alert){
		var tmp_html=''
		for (x in label.alerts){			
			tmp_html+='<div class="alert alert-info container-fluid" role="alert"><strong>Alert! </strong>'
			tmp_html+=label["alerts"][x]["value"];
			tmp_html+='<span title="'+ label.close_alert+'" role="close-alert" class="glyphicon glyphicon-remove close-alert"></span></div>'}	
		$("#div_center").prepend(tmp_html);
		//HIDE ALERT DIVS UPON CLICK
		$("span[role='close-alert']").click(function(){
			$(this).parent("div").hide()
			window.sessionStorage.close_alert="true"
			})
	}
	//SWITCH LANGUAGE UPON CLICK
    $("a[to_lang]").click(function(){alert('Multi-Language Support will come soon')})
	
	
	//LOAD DROPDOWN LISTS
	var tmp_html=""
	var tmp_array=new Array()
	var tmp_json={}
	$.each(design,function(key){
		
		if(key!="basic"){
		tmp_array.push(design[key]["pinyin"])
		tmp_json[design[key]["pinyin"]]=key
		}
		
		})
	tmp_array=tmp_array.sort()
	
	
	$.each(tmp_array,function(key){
		tmp_html+='<li><a href="design.html?unit='+tmp_json[tmp_array[key]]+'&lang='+lang+'">'+design[tmp_json[tmp_array[key]]]["name"]+'</a></li>'
		
		})	
	
	$("ul[role='menu']").append(tmp_html)
	
	
	
	//BAIDU TONGJI
	var _hmt = _hmt || [];
	(function() {
	  var hm = document.createElement("script");
	  hm.src = "//hm.baidu.com/hm.js?de4e9e26927f232f1bdef88a1218fbc8";
	  var s = document.getElementsByTagName("script")[0]; 
	  s.parentNode.insertBefore(hm, s);})();
	})