#!/usr/bin/env node
"use strict";
module.exports=class he_module{
	constructor(finish_request,obj){
		this.content=obj.content;
		this.replace=obj.replace;
		this.session=obj.session;
		this.global=obj.global;
		this.path_array=obj.path_array;
		this._GET=obj._GET;
		this._POST=obj._POST;
		this.cookies=obj.cookies;
		this.response=obj.response;

		this.exec(finish_request);
	}
	exec(callback){
		this.replace.title='Watch control - '+this.replace.title;
		if(this.session.auth){
			if(typeof this._GET.action !== 'undefined'){
				if('stop'==this._GET.action){
					if('steem'==this._GET.id){
						this.global.watch_manager.steem=0;
					}
					if('golos'==this._GET.id){
						this.global.watch_manager.golos=0;
					}
				}
				if('restart'==this._GET.action){
					if('steem'==this._GET.id){
						this.global.watch_manager.steem=1;
					}
					if('golos'==this._GET.id){
						this.global.watch_manager.golos=1;
					}
				}
				if('continue'==this._GET.action){
					if('steem'==this._GET.id){
						this.global.watch_manager.steem=2;
					}
					if('golos'==this._GET.id){
						this.global.watch_manager.golos=2;
					}
				}
				this.session.redirect=true;
				this.response.redirect(302,'/watch-control/');
			}
			this.content+=`<h1>Watcher list</h1><ul>`;
			this.content+=`<li>Steem: `;
			if(2==this.global.watch_manager.steem){
				this.content+=`continuing on block id: #`+this.global.steem_watch_block_id+`, refresh page later`;
			}
			if(1==this.global.watch_manager.steem){
				this.content+=`working, block id: #`+this.global.steem_watch_block_id+`, actions: <a href="/watch-control/?action=stop&id=steem">stop</a>`;
			}
			if(0==this.global.watch_manager.steem){
				this.content+=`stopped on block id: #`+this.global.steem_watch_block_id+`, actions: <a href="/watch-control/?action=continue&id=steem">continue</a>, <a href="/watch-control/?action=restart&id=steem">restart</a>`;
			}
			this.content+=`</li>`;
			this.content+=`<li>Golos: `;
			if(2==this.global.watch_manager.golos){
				this.content+=`continuing on block id: #`+this.global.golos_watch_block_id+`, refresh page later`;
			}
			if(1==this.global.watch_manager.golos){
				this.content+=`working, block id: #`+this.global.golos_watch_block_id+`, actions: <a href="/watch-control/?action=stop&id=golos">stop</a>`;
			}
			if(0==this.global.watch_manager.golos){
				this.content+=`stopped on block id: #`+this.global.golos_watch_block_id+`, actions: <a href="/watch-control/?action=continue&id=golos">continue</a>, <a href="/watch-control/?action=restart&id=golos">restart</a>`;
			}
			this.content+=`</li>`;
			this.content+=`</ul>`;
		}
		else{
			this.content+='<p><strong>Warning! </strong>Not authorized</p>';
			this.content+='<p><a href="/login/">Login</a></p>';
		}
		callback({
			'content':this.content,
			'replace':this.replace,
			'session':this.session,
			'global':this.global,
			'response':this.response,
			'path_array':this.path_array,
			'_GET':this._GET,
			'_POST':this._POST,
			'cookies':this.cookies,
		});
	}
}