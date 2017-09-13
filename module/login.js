#!/usr/bin/env node
"use strict";
var crypto = require('crypto');
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
		if(this.session.auth){
			this.session.redirect=true;
			this.res.redirect(302,'/');
		}
		else{
			if(typeof this._POST.login !== 'undefined'){
				this.res.cookie('login',this._POST.login,{});
				this.res.cookie('password',crypto.createHash('md5').update(this._POST.password).digest("hex"),{});
				this.session.redirect=true;
				this.res.redirect(302,'/login/');
			}
			this.content+='<h1>Authorization</h1>';
			if(''!=this.cookies.login){
				this.content+='<p><strong>Auth error!</strong></p>';
			}
			this.content+=`<form action="" method="POST">
			<input type="text" name="login" placeholder="Login"><br>
			<input type="password" name="password" placeholder="Password"><br>
			<input type="submit" value="Enter">
			</form>`;
		}
	}
	result(){
		return {'content':this.content,'replace':this.replace,'response':this.res,'global':this.global,'session':this.session}
	}
}