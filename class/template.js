#!/usr/bin/env node
"use strict";
var fs=require('fs');
module.exports=class he_template{
	constructor(template_dir){
		this.file_root='./';
		this.file_buf={};
		this.last='';
		if(typeof template_dir !== 'undefined'){
			this.dir(template_dir);
		}
	}
	dir(template_dir){
		this.file_root=template_dir;
	}
	open(filename,name,callback){
		this.last=name;
		var data_buf='';
		var stream=fs.createReadStream(this.file_root+filename);
		var _this=this;
		stream.on('data',function(chunk){
			data_buf+=chunk;
		}).on('end', function(){
			_this.file_buf[_this.last]=data_buf;
			this.close();
			callback();
		});
	}
	get(name){
		if(typeof name !== 'undefined'){
			this.last=name;
		}
		return this.file_buf[this.last];
	}
	set(name,value){
		if(typeof name !== 'undefined'){
			this.last=name;
			this.file_buf[this.last]=value;
		}
	}
	assign(tag,value,name){
		if(typeof name !== 'undefined'){
			this.last=name;
		}
		if(typeof this.file_buf[this.last] !== 'undefined'){
			this.file_buf[this.last]=this.file_buf[this.last].toString().replace('{'+tag+'}',value);
		}
	}
}