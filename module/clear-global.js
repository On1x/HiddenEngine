#!/usr/bin/env node
"use strict";
module.exports=class he_module{
	constructor(obj){
		this.global=obj.global;
		this.session=obj.session;
		this.content=obj.content;
		this.replace=obj.replace;
		this.path_array=obj.path_array;
		this._GET=obj._GET;
		this._POST=obj._POST;
		this.cookies=obj.cookies;
		this.res=obj.res;
	}
	exec(){
		this.global.accounts=[];
		this.global.counters={};
		this.global.counters.accounts=0;
		this.session.redirect=true;
		this.res.redirect(302,'/');
	}
	result(){
		return {'content':this.content,'replace':this.replace,'response':this.res,'global':this.global,'session':this.session}
	}
}