#!/usr/bin/env node
"use strict";
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
			if(''==_this.path_array[2]){
				_this.replace.title='Upvote circle - '+_this.replace.title;
				if(_this.session.auth){
					if(typeof _this._POST.add_vote_action !== 'undefined'){
						for(var account of global.he.accounts){
							if(account.type==parseInt(_this._POST.type)){
								if(typeof account.upvote_circle !== 'undefined'){
									if(1==account.upvote_circle){
										if(typeof account.posting_key !== 'undefined'){
											if(''!=account.posting_key){
												var queue_item={'action':'vote','data':{'user_login':account.login,'user_posting_key':account.posting_key,'target_login':_this._POST.target_login,'target_permlink':_this._POST.target_permlink,'vote_weight':parseInt(_this._POST.vote_weight)}};
												if(parseInt(_this._POST.action_delay)>0){
													queue_item.time=new Date().getTime() + (parseInt(_this._POST.action_delay)*1000);
												}											if(1==parseInt(_this._POST.type)){
													queue_item.id=++global.he.counters.steem_queue;
													global.he.steem_queue.push(queue_item);
												}
												if(2==parseInt(_this._POST.type)){
													queue_item.id=++global.he.counters.golos_queue;
													global.he.golos_queue.push(queue_item);
												}
											}
										}
									}
								}
							}
						}
						_this.session.redirect=true;
						_this.response.redirect(302,'/upvote-circle/');
					}
					else
					if(typeof _this._POST.add_flag_action !== 'undefined'){
						for(var account of global.he.accounts){
							if(account.type==parseInt(_this._POST.type)){
								if(typeof account.upvote_circle !== 'undefined'){
									if(1==account.upvote_circle){
										if(typeof account.posting_key !== 'undefined'){
											if(''!=account.posting_key){
												var queue_item={'action':'flag','data':{'user_login':account.login,'user_posting_key':account.posting_key,'target_login':_this._POST.target_login,'target_permlink':_this._POST.target_permlink,'vote_weight':parseInt(_this._POST.vote_weight)}};
												if(parseInt(_this._POST.action_delay)>0){
													queue_item.time=new Date().getTime() + (parseInt(_this._POST.action_delay)*1000);
												}
												if(1==parseInt(_this._POST.type)){
													queue_item.id=++global.he.counters.steem_queue;
													global.he.steem_queue.push(queue_item);
												}
												if(2==parseInt(_this._POST.type)){
													queue_item.id=++global.he.counters.golos_queue;
													global.he.golos_queue.push(queue_item);
												}
											}
										}
									}
								}
							}
						}
						_this.session.redirect=true;
						_this.response.redirect(302,'/upvote-circle/');
					}
					else
					if(typeof _this._POST.add_witness_vote_action !== 'undefined'){
						for(var account of global.he.accounts){
							if(account.type==parseInt(_this._POST.type)){
								if(typeof account.upvote_circle !== 'undefined'){
									if(1==account.upvote_circle){
										if(typeof account.active_key !== 'undefined'){
											if(''!=account.active_key){
												var queue_item={'action':'witness_vote','data':{'user_login':account.login,'user_active_key':account.active_key,'target_login':_this._POST.target_login}};
												if(parseInt(_this._POST.action_delay)>0){
													queue_item.time=new Date().getTime() + (parseInt(_this._POST.action_delay)*1000);
												}
												if(1==parseInt(_this._POST.type)){
													queue_item.id=++global.he.counters.steem_queue;
													global.he.steem_queue.push(queue_item);
												}
												if(2==parseInt(_this._POST.type)){
													queue_item.id=++global.he.counters.golos_queue;
													global.he.golos_queue.push(queue_item);
												}
											}
										}
									}
								}
							}
						}
						_this.session.redirect=true;
						_this.response.redirect(302,'/upvote-circle/');
					}
					else
					if(typeof _this._POST.add_witness_unvote_action !== 'undefined'){
						for(var account of global.he.accounts){
							if(account.type==parseInt(_this._POST.type)){
								if(typeof account.upvote_circle !== 'undefined'){
									if(1==account.upvote_circle){
										if(typeof account.active_key !== 'undefined'){
											if(''!=account.active_key){
												var queue_item={'action':'witness_unvote','data':{'user_login':account.login,'user_active_key':account.active_key,'target_login':_this._POST.target_login}};
												if(parseInt(_this._POST.action_delay)>0){
													queue_item.time=new Date().getTime() + (parseInt(_this._POST.action_delay)*1000);
												}
												if(1==parseInt(_this._POST.type)){
													queue_item.id=++global.he.counters.steem_queue;
													global.he.steem_queue.push(queue_item);
												}
												if(2==parseInt(_this._POST.type)){
													queue_item.id=++global.he.counters.golos_queue;
													global.he.golos_queue.push(queue_item);
												}
											}
										}
									}
								}
							}
						}
						_this.session.redirect=true;
						_this.response.redirect(302,'/upvote-circle/');
					}
					else
					if('deactivate'==_this._GET.action){
						var id=parseInt(_this._GET.id);
						for(var i=0;i<global.he.accounts.length;i++){
							if(global.he.accounts[i].id==id){
								global.he.accounts[i].upvote_circle=0;
							}
						}
						_this.session.redirect=true;
						_this.response.redirect(302,'/upvote-circle/');
					}
					else
					if('activate'==_this._GET.action){
						var id=parseInt(_this._GET.id);
						for(var i=0;i<global.he.accounts.length;i++){
							if(global.he.accounts[i].id==id){
								global.he.accounts[i].upvote_circle=1;
							}
						}
						_this.session.redirect=true;
						_this.response.redirect(302,'/upvote-circle/');
					}
					else
					if('deactivate_all'==_this._GET.action){
						var id=parseInt(_this._GET.id);
						for(var i=0;i<global.he.accounts.length;i++){
								global.he.accounts[i].upvote_circle=0;
						}
						_this.session.redirect=true;
						_this.response.redirect(302,'/upvote-circle/');
					}
					else
					if('activate_all'==_this._GET.action){
						var id=parseInt(_this._GET.id);
						for(var i=0;i<global.he.accounts.length;i++){
								global.he.accounts[i].upvote_circle=1;
						}
						_this.session.redirect=true;
						_this.response.redirect(302,'/upvote-circle/');
					}
					else
					if('add_vote'==_this._GET.action){
						_this.content+=`<h1>Upvote circle list</h1>`;
						_this.content+=`<h2>Adding vote action</h2>`;
						_this.content+=`<form action="" method="POST">
						Blockchain:<br>
						<select name="type">
							<option value="1">Steem</option>
							<option value="2" selected>Golos</option>
						</select>
						<br>Target login:<br><input type="text" name="target_login" value="">
						<br>Target permlink:<br><input type="text" name="target_permlink" value="">
						<br>Vote weight:<br><input type="text" name="vote_weight" value="10000">
						<br>Delay:<br><input type="text" name="action_delay" value="" placeholder="seconds">
						<hr><input type="submit" class="button" name="add_vote_action" value="Submit">
						</form>`;
					}
					else
					if('add_flag'==_this._GET.action){
						_this.content+=`<h1>Upvote circle list</h1>`;
						_this.content+=`<h2>Adding flag action</h2>`;
						_this.content+=`<form action="" method="POST">
						Blockchain:<br>
						<select name="type">
							<option value="1">Steem</option>
							<option value="2" selected>Golos</option>
						</select>
						<br>Target login:<br><input type="text" name="target_login" value="">
						<br>Target permlink:<br><input type="text" name="target_permlink" value="">
						<br>Flag weight:<br><input type="text" name="vote_weight" value="10000">
						<br>Delay:<br><input type="text" name="action_delay" value="" placeholder="seconds">
						<hr><input type="submit" class="button" name="add_flag_action" value="Submit">
						</form>`;
					}
					else
					if('add_witness_vote'==_this._GET.action){
						_this.content+=`<h1>Upvote circle list</h1>`;
						_this.content+=`<h2>Adding witness vote action</h2>`;
						_this.content+=`<form action="" method="POST">
						Blockchain:<br>
						<select name="type">
							<option value="1">Steem</option>
							<option value="2" selected>Golos</option>
						</select>
						<br>Target login:<br><input type="text" name="target_login" value="">
						<br>Delay:<br><input type="text" name="action_delay" value="" placeholder="seconds">
						<hr><input type="submit" class="button" name="add_witness_vote_action" value="Submit">
						</form>`;
					}
					else
					if('add_witness_unvote'==_this._GET.action){
						_this.content+=`<h1>Upvote circle list</h1>`;
						_this.content+=`<h2>Adding witness unvote action</h2>`;
						_this.content+=`<form action="" method="POST">
						Blockchain:<br>
						<select name="type">
							<option value="1">Steem</option>
							<option value="2" selected>Golos</option>
						</select>
						<br>Target login:<br><input type="text" name="target_login" value="">
						<br>Delay:<br><input type="text" name="action_delay" value="" placeholder="seconds">
						<hr><input type="submit" class="button" name="add_witness_unvote_action" value="Submit">
						</form>`;
					}
					else{
						_this.content+=`<h1>Upvote circle list</h1>`;
						_this.content+=`
						<p>
							<a class="button" href="?action=add_vote">Add vote action</a>
							<a class="button" href="?action=add_flag">Add flag action</a>
							<a class="button" href="?action=add_witness_vote">Add witness vote action</a>
							<a class="button" href="?action=add_witness_unvote">Add witness unvote action</a>
							<a class="button" href="?action=activate_all">Activate all</a>
							<a class="button" href="?action=deactivate_all">Deactivate all</a>
						</p>`;
						_this.content+=`<p></p>`;
						_this.content+=`<table class="object_view"><thead><tr>
							<th width="5%">id</th>
							<th width="5%">Type</th>
							<th width="25%">Login</th>
							<th width="25%">Status</th>
							<th width="40%">Actions</th>
						</tr>
						</thead>
						<tbody>`;
						for(var m of global.he.accounts){
							_this.content+=`
						<tr>
							<td>${m.id}</td>
							<td>`+(1==m.type?'STEEM':'GOLOS')+`</td>
							<td>${m.login}</td>`;
							if(1==m.upvote_circle){
								_this.content+=`
								<td>Active</td><th><a href="/upvote-circle/?action=deactivate&id=${m.id}">DEACTIVATE</a></th>`;
							}
							else{
								_this.content+=`
								<td>Inactive</td><th><a href="/upvote-circle/?action=activate&id=${m.id}">ACTIVATE</a></th>`;
							}
							_this.content+=`</tr>`;
						}
						_this.content+=`</tbody></table>`;
					}
				}
				else{
					_this.content+='<p><strong>Warning! </strong>Not authorized</p>';
					_this.content+='<p><a href="/login/">Login</a></p>';
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