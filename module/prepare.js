#!/usr/bin/env node
"use strict";
var crypto = require('crypto');
module.exports=class he_module{
	constructor(obj){
		this.global=obj.global;
		this.content=obj.content;
		this.replace=obj.replace;
		this.path_array=obj.path_array;
		this._GET=obj._GET;
		this._POST=obj._POST;
		this.cookies=obj.cookies;
		this.res=obj.res;
	}
	exec(){
		var admin_login='admin';
		var admin_password='he_admin_password';
		var admin_password_hash=crypto.createHash('md5').update(admin_password).digest("hex");

		this.global.redirect=false;
		this.replace.title='NodeJS Hidden Engine';
		this.replace.description='Light engine for node.js apps, author Anatoly Piskunov';
		this.global.auth=false;
		if(typeof this.cookies.login !== 'undefined'){
			if(this.cookies.login==admin_login){
				if(this.cookies.password==admin_password_hash){
					this.global.auth=true;
				}
			}
		}
	}
	result(){
		return {'content':this.content,'replace':this.replace,'response':this.res,'global':this.global}
	}
}