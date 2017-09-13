#!/usr/bin/env node
var app_port=3000;
var zlib = require('zlib');
var http=require('http');
var express=require('express');
var bodyparser=require('body-parser');
var fs=require('fs');
var app=express();
var _GET={};
var _POST={};
var cookies={};
var path_query='';
var path='';
var path_array=[];
var result='';
var	content='';
var replace={};
var global={};
var url_reg = new RegExp('^[a-z0-9A-Z\-_!~@\$\% \+\=\*\&:;,\.]+$');

var he_template=require('./class/template.js');
var t=new he_template('./templates/');
t.open('index.tpl','content');

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

function parse_cookies(request){
	var list = {},
		rc = request.headers.cookie;
	rc && rc.split(';').forEach(function( cookie ) {
		var parts = cookie.split('=');
		list[parts.shift().trim()] = decodeURI(parts.join('='));
	});
	return list;
}

function parse_query(el,i,arr){
	var buf_arr=el.split('=');
	if(buf_arr[0]){
		_GET[buf_arr[0]]=buf_arr[1];
	}
}

function parse_url(url){
	var find_query=url.indexOf('?');
	if(typeof find_query !== 'undefined'){
		var path_query_arr=url.split('?');
		path=''+path_query_arr[0];
		path_query=''+path_query_arr[1];
		var find_query_delimiter=path_query.indexOf('&');
		if(typeof find_query_delimiter !== 'undefined'){
			path_query_arr=path_query.split('&');
			path_query_arr.forEach(parse_query);
		}
		else{
			parse_query(path_query,0,_GET);
		}
	}
	path_array=path.split('/');
}

function fresh_query(req){
	t.open('index.tpl','content');
	_GET={};
	_POST={};
	cookies={};
	path_query='';
	path='';
	path_array=[];
	result='';
	content='';
	replace={};
	global={};
	_POST=req.body;
	cookies=parse_cookies(req);
	parse_url(req.url);
}

app.all('*',function(req,res){
	fresh_query(req);

	var module_name='prepare';
	var module_file='./module/'+module_name+'.js';
	if(fs.existsSync(module_file)){
		var he_module=require(module_file);
		var module=new he_module({'path_array':path_array,'content':content,'_GET':_GET,'_POST':_POST,'replace':replace,'res':res,'cookies':cookies,'global':global});
		module.exec();
		content=module.result().content;
		replace=module.result().replace;
		global=module.result().global;
		res=module.result().response;
	}

	var module_name='index';
	if(''!=path_array[1]){
		if(url_reg.test(path_array[1])){
			module_name=path_array[1];
		}
	}
	var module_file='./module/'+module_name+'.js';
	if(fs.existsSync(module_file)){
		var he_module=require(module_file);
		var module=new he_module({'path_array':path_array,'content':content,'_GET':_GET,'_POST':_POST,'replace':replace,'res':res,'cookies':cookies,'global':global});
		module.exec();
		content=module.result().content;
		replace=module.result().replace;
		global=module.result().global;
		res=module.result().response;
	}

	if(!global.redirect){
		replace.content=content;
		Object.keys(replace).forEach(function(key){
			t.assign(key,replace[key]);
		});
		if(''!=replace.content){
			result=t.get();
		}
		else{
			res.status(404).end('Not Found');
		}

		var buf = new Buffer(result, 'utf-8');
		res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8', 'Content-Encoding': 'gzip'});
		zlib.gzip(buf, function (_, result) {
			res.end(result);
		});
	}
});

app.listen(app_port,function(){
	console.log(`Starting Hidden Engine on ${app_port} port...`);
});