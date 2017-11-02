#!/usr/bin/env node
"use strict";
var crypto = require('crypto');
module.exports=class he_module{
	constructor(obj){
		let _this=this;
		return new Promise(function(resolve,reject){
			_this.content=obj.content;
			_this.replace=obj.replace;
			_this.session=obj.session;
			_this.path_array=obj.path_array;
			_this._GET=obj._GET;
			_this._POST=obj._POST;
			_this.cookies=obj.cookies;
			_this.response=obj.response;
			resolve(_this.exec());
		});
	}
	exec(){
		let _this=this;
		return new Promise(function(resolve,reject){
			if(_this.session.auth){
				_this.session.redirect=true;
				_this.response.redirect(302,'/');
			}
			else{
				if(typeof _this._POST.login !== 'undefined'){
					_this.response.cookie('login',_this._POST.login,{});
					_this.response.cookie('password',crypto.createHash('md5').update(_this._POST.password).digest("hex"),{});
					_this.session.redirect=true;
					_this.response.redirect(302,'/login/');
				}
				_this.session.change_template='engine-login.tpl';
				_this.replace.title='Authorization - '+_this.replace.title;
				if(''!=_this.cookies.login){
					_this.content+='<p><strong>Auth error!</strong></p>';
				}
				_this.content+=`<form class="admin-login" action="/login/" method="POST">
<input type="text" name="login"> &mdash; Login<br>
<input type="password" name="password"> &mdash; Password<br>
<input type="submit" value="Enter">
</form>`;
			}
			resolve({
				'content':_this.content,
				'replace':_this.replace,
				'session':_this.session,
				'response':_this.response,
				'path_array':_this.path_array,
				'_GET':_this._GET,
				'_POST':_this._POST,
				'cookies':_this.cookies,
			});
		});
	}
}