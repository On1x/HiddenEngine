#!/usr/bin/env node
"use strict";
if(typeof simple_date == "undefined"){
	var simple_date=function(timestamp){
		let d=new Date(timestamp);
		let day=d.getDate();
		if(day<10){
			day='0'+day;
		}
		let month=d.getMonth()+1;
		if(month<10){
			month='0'+month;
		}
		let minutes=d.getMinutes();
		if(minutes<10){
			minutes='0'+minutes;
		}
		let seconds=d.getSeconds();
		if(seconds<10){
			seconds='0'+seconds;
		}
		let hours=d.getHours();
		if(hours<10){
			hours='0'+hours;
		}
		return ''+day+'.'+month+'.'+d.getFullYear()+' '+hours+':'+minutes+':'+seconds;
	}
}
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
			_this.replace.title='Watch control - '+_this.replace.title;
			if(_this.session.auth){
				if(typeof _this._GET.action !== 'undefined'){
					if('stop'==_this._GET.action){
						if('steem'==_this._GET.id){
							global.he.watch_manager.steem=0;
						}
						if('golos'==_this._GET.id){
							global.he.watch_manager.golos=0;
						}
					}
					if('restart'==_this._GET.action){
						if('steem'==_this._GET.id){
							global.he.watch_manager.steem=1;
						}
						if('golos'==_this._GET.id){
							global.he.watch_manager.golos=1;
						}
					}
					if('continue'==_this._GET.action){
						if('steem'==_this._GET.id){
							global.he.watch_manager.steem=2;
						}
						if('golos'==_this._GET.id){
							global.he.watch_manager.golos=2;
						}
					}
					_this.session.redirect=true;
					_this.response.redirect(302,'/watch-control/');
				}
				_this.content+=`<h1>Watcher list</h1><ul>`;
				_this.content+=`<li>Steem: `;
				if(2==global.he.watch_manager.steem){
					_this.content+=`continuing on block id: #`+global.he.steem_watch_block_id+`, refresh page later`;
				}
				if(1==global.he.watch_manager.steem){
					_this.content+=`working, block id: #`+global.he.steem_watch_block_id+`, actions: <a href="/watch-control/?action=stop&id=steem">stop</a>`;
				}
				if(0==global.he.watch_manager.steem){
					_this.content+=`stopped on block id: #`+global.he.steem_watch_block_id+`, actions: <a href="/watch-control/?action=continue&id=steem">continue</a>, <a href="/watch-control/?action=restart&id=steem">restart</a>`;
				}
				_this.content+=`</li>`;
				_this.content+=`<li>Golos: `;
				if(2==global.he.watch_manager.golos){
					_this.content+=`continuing on block id: #`+global.he.golos_watch_block_id+`, refresh page later`;
				}
				if(1==global.he.watch_manager.golos){
					_this.content+=`working, block id: #`+global.he.golos_watch_block_id+`, actions: <a href="/watch-control/?action=stop&id=golos">stop</a>`;
				}
				if(0==global.he.watch_manager.golos){
					_this.content+=`stopped on block id: #`+global.he.golos_watch_block_id+`, actions: <a href="/watch-control/?action=continue&id=golos">continue</a>, <a href="/watch-control/?action=restart&id=golos">restart</a>`;
				}
				_this.content+=`</li>`;
				_this.content+=`</ul>`;
				_this.content+='<h2>History</h2>';
				for(let i in global.he.history){
					_this.content+='<p>'+simple_date(global.he.history[i].t)+': '+global.he.history[i].s+'</p>';
				}
			}
			else{
				_this.content+='<p><strong>Warning! </strong>Not authorized</p>';
				_this.content+='<p><a href="/login/">Login</a></p>';
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