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
			var admin_login=global.he.admin.login;
			var admin_password=global.he.admin.password;

			_this.session.change_template='index.tpl';
			_this.session.redirect=false;
			_this.replace.title='HiddenEngine';
			_this.replace.menu='';
			_this.replace.description='Light engine for node.js apps';
			_this.session.auth=false;
			if(typeof _this.cookies.login !== 'undefined'){
				if(_this.cookies.login==admin_login){
					if(_this.cookies.password==admin_password){
						_this.session.auth=true;
						_this.session.change_template='engine-index.tpl';
						_this.replace.menu+=`<div class="grey" style="margin:10px;text-align:right;position:absolute;text-align:right;right:55px;">Your login: ${admin_login}</div>`;
						_this.replace.menu+='<ul class="admin-menu">';
						var admin_menu={
							'accounts':'Accounts',
							'upvote-circle':'Upvote circle',
							'watch-control':'Watch control',
							//'api':'API',
						};
						for(var menu in admin_menu){
							_this.replace.menu+='<li'+(_this.path_array[1]==menu?' class="selected"':'')+'><a href="/'+menu+'/">'+admin_menu[menu]+'</a></li>';
						}
						_this.replace.menu+='<li class="exit"><a href="/logout/">Logout</a></li></ul>';
					}
				}
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