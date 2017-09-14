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
		this.content+='<h1>Change admin access</h1>';
		if(this.session.auth){
			if(typeof this._POST.login !== 'undefined'){
				if(this._POST.password==this._POST.password2){
					this.global.admin.login=this._POST.login;
					this.global.admin.password=this._POST.password;
					this.res.cookie('login',this._POST.login,{});
					this.res.cookie('password',crypto.createHash('md5').update(this._POST.password).digest("hex"),{});
					this.session.redirect=true;
					this.res.redirect(302,'/');
				}
				else{
					this.content+='<p><strong>Passwords missmatch!</strong></p>';
				}
			}
			this.content+=`<form action="" method="POST">
			<input type="text" name="login" placeholder="New login"><br>
			<input type="password" name="password" placeholder="New password"><br>
			<input type="password" name="password2" placeholder="Repeat new password"><br>
			<input type="submit" value="Change">
			</form>`;
		}
		else{
			this.content+='<p><strong>Warning! </strong>Not authorized</p>';
			this.content+='<p><a href="/login/">Login</a></p>';
		}
	}
	result(){
		return {'content':this.content,'replace':this.replace,'response':this.res,'global':this.global,'session':this.session}
	}
}