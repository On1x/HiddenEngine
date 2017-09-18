#!/usr/bin/env node
"use strict";
module.exports=class he_module{
	constructor(finish_request,obj){
		this.content=obj.content;
		this.replace=obj.replace;
		this.session=obj.session;
		this.path_array=obj.path_array;
		this._GET=obj._GET;
		this._POST=obj._POST;
		this.cookies=obj.cookies;
		this.response=obj.response;

		this.exec(finish_request);
	}
	exec(callback){
		if(''==this.path_array[2]){
			this.replace.title='Upvote circle - '+this.replace.title;
			if(this.session.auth){
				if(typeof this._POST.add_vote_action !== 'undefined'){
					for(var account of global.he.accounts){
						if(account.type==parseInt(this._POST.type)){
							if(typeof account.upvote_circle !== 'undefined'){
								if(1==account.upvote_circle){
									if(typeof account.posting_key !== 'undefined'){
										if(''!=account.posting_key){
											var queue_item={'action':'vote','data':{'user_login':account.login,'user_posting_key':account.posting_key,'target_login':this._POST.target_login,'target_permlink':this._POST.target_permlink,'vote_weight':parseInt(this._POST.vote_weight)}};
											queue_item.id=++global.he.counters.golos_queue;
											global.he.golos_queue.push(queue_item);
										}
									}
								}
							}
						}
					}
					this.session.redirect=true;
					this.response.redirect(302,'/upvote-circle/');
				}
				else
				if(typeof this._POST.add_flag_action !== 'undefined'){
					for(var account of global.he.accounts){
						if(account.type==parseInt(this._POST.type)){
							if(typeof account.upvote_circle !== 'undefined'){
								if(1==account.upvote_circle){
									if(typeof account.posting_key !== 'undefined'){
										if(''!=account.posting_key){
											var queue_item={'action':'flag','data':{'user_login':account.login,'user_posting_key':account.posting_key,'target_login':this._POST.target_login,'target_permlink':this._POST.target_permlink,'vote_weight':parseInt(this._POST.vote_weight)}};
											queue_item.id=++global.he.counters.golos_queue;
											global.he.golos_queue.push(queue_item);
										}
									}
								}
							}
						}
					}
					this.session.redirect=true;
					this.response.redirect(302,'/upvote-circle/');
				}
				else
				if(typeof this._POST.add_witness_vote_action !== 'undefined'){
					for(var account of global.he.accounts){
						if(account.type==parseInt(this._POST.type)){
							if(typeof account.upvote_circle !== 'undefined'){
								if(1==account.upvote_circle){
									if(typeof account.active_key !== 'undefined'){
										if(''!=account.active_key){
											var queue_item={'action':'witness_vote','data':{'user_login':account.login,'user_active_key':account.active_key,'target_login':this._POST.target_login}};
											queue_item.id=++global.he.counters.golos_queue;
											global.he.golos_queue.push(queue_item);
										}
									}
								}
							}
						}
					}
					this.session.redirect=true;
					this.response.redirect(302,'/upvote-circle/');
				}
				else
				if(typeof this._POST.add_witness_unvote_action !== 'undefined'){
					for(var account of global.he.accounts){
						if(account.type==parseInt(this._POST.type)){
							if(typeof account.upvote_circle !== 'undefined'){
								if(1==account.upvote_circle){
									if(typeof account.active_key !== 'undefined'){
										if(''!=account.active_key){
											var queue_item={'action':'witness_unvote','data':{'user_login':account.login,'user_active_key':account.active_key,'target_login':this._POST.target_login}};
											queue_item.id=++global.he.counters.golos_queue;
											global.he.golos_queue.push(queue_item);
										}
									}
								}
							}
						}
					}
					this.session.redirect=true;
					this.response.redirect(302,'/upvote-circle/');
				}
				else
				if('deactivate'==this._GET.action){
					var id=parseInt(this._GET.id);
					for(var i=0;i<global.he.accounts.length;i++){
						if(global.he.accounts[i].id==id){
							global.he.accounts[i].upvote_circle=0;
						}
					}
					this.session.redirect=true;
					this.response.redirect(302,'/upvote-circle/');
				}
				else
				if('activate'==this._GET.action){
					var id=parseInt(this._GET.id);
					for(var i=0;i<global.he.accounts.length;i++){
						if(global.he.accounts[i].id==id){
							global.he.accounts[i].upvote_circle=1;
						}
					}
					this.session.redirect=true;
					this.response.redirect(302,'/upvote-circle/');
				}
				else
				if('deactivate_all'==this._GET.action){
					var id=parseInt(this._GET.id);
					for(var i=0;i<global.he.accounts.length;i++){
							global.he.accounts[i].upvote_circle=0;
					}
					this.session.redirect=true;
					this.response.redirect(302,'/upvote-circle/');
				}
				else
				if('activate_all'==this._GET.action){
					var id=parseInt(this._GET.id);
					for(var i=0;i<global.he.accounts.length;i++){
							global.he.accounts[i].upvote_circle=1;
					}
					this.session.redirect=true;
					this.response.redirect(302,'/upvote-circle/');
				}
				else
				if('add_vote'==this._GET.action){
					this.content+=`<h1>Upvote circle list</h1>`;
					this.content+=`<h2>Adding vote action</h2>`;
					this.content+=`<form action="" method="POST">
					Blockchain:<br>
					<select name="type">
						<option value="1">Steem</option>
						<option value="2" selected>Golos</option>
					</select>
					<br>Target login:<br><input type="text" name="target_login" value="">
					<br>Target permlink:<br><input type="text" name="target_permlink" value="">
					<br>Vote weight:<br><input type="text" name="vote_weight" value="10000">
					<hr><input type="submit" class="button" name="add_vote_action" value="Submit">
					</form>`;
				}
				else
				if('add_flag'==this._GET.action){
					this.content+=`<h1>Upvote circle list</h1>`;
					this.content+=`<h2>Adding flag action</h2>`;
					this.content+=`<form action="" method="POST">
					Blockchain:<br>
					<select name="type">
						<option value="1">Steem</option>
						<option value="2" selected>Golos</option>
					</select>
					<br>Target login:<br><input type="text" name="target_login" value="">
					<br>Target permlink:<br><input type="text" name="target_permlink" value="">
					<br>Flag weight:<br><input type="text" name="vote_weight" value="10000">
					<hr><input type="submit" class="button" name="add_flag_action" value="Submit">
					</form>`;
				}
				else
				if('add_witness_vote'==this._GET.action){
					this.content+=`<h1>Upvote circle list</h1>`;
					this.content+=`<h2>Adding witness vote action</h2>`;
					this.content+=`<form action="" method="POST">
					Blockchain:<br>
					<select name="type">
						<option value="1">Steem</option>
						<option value="2" selected>Golos</option>
					</select>
					<br>Target login:<br><input type="text" name="target_login" value="">
					<hr><input type="submit" class="button" name="add_witness_vote_action" value="Submit">
					</form>`;
				}
				else
				if('add_witness_unvote'==this._GET.action){
					this.content+=`<h1>Upvote circle list</h1>`;
					this.content+=`<h2>Adding witness unvote action</h2>`;
					this.content+=`<form action="" method="POST">
					Blockchain:<br>
					<select name="type">
						<option value="1">Steem</option>
						<option value="2" selected>Golos</option>
					</select>
					<br>Target login:<br><input type="text" name="target_login" value="">
					<hr><input type="submit" class="button" name="add_witness_unvote_action" value="Submit">
					</form>`;
				}
				else{
					this.content+=`<h1>Upvote circle list</h1>`;
					this.content+=`
					<p>
						<a class="button" href="?action=add_vote">Add vote action</a>
						<a class="button" href="?action=add_flag">Add flag action</a>
						<a class="button" href="?action=add_witness_vote">Add witness vote action</a>
						<a class="button" href="?action=add_witness_unvote">Add witness unvote action</a>
						<a class="button" href="?action=activate_all">Activate all</a>
						<a class="button" href="?action=deactivate_all">Deactivate all</a>
					</p>`;
					this.content+=`<p></p>`;
					this.content+=`<table class="object_view"><thead><tr>
						<th width="5%">id</th>
						<th width="5%">Type</th>
						<th width="25%">Login</th>
						<th width="25%">Status</th>
						<th width="40%">Actions</th>
					</tr>
					</thead>
					<tbody>`;
					for(var m of global.he.accounts){
						this.content+=`
					<tr>
						<td>${m.id}</td>
						<td>`+(1==m.type?'STEEM':'GOLOS')+`</td>
						<td>${m.login}</td>`;
						if(1==m.upvote_circle){
							this.content+=`
							<td>Active</td><th><a href="/upvote-circle/?action=deactivate&id=${m.id}">DEACTIVATE</a></th>`;
						}
						else{
							this.content+=`
							<td>Inactive</td><th><a href="/upvote-circle/?action=activate&id=${m.id}">ACTIVATE</a></th>`;
						}
						this.content+=`</tr>`;
					}
					this.content+=`</tbody></table>`;
				}
			}
			else{
				this.content+='<p><strong>Warning! </strong>Not authorized</p>';
				this.content+='<p><a href="/login/">Login</a></p>';
			}
		}

		callback({
			'content':this.content,
			'replace':this.replace,
			'session':this.session,
			'response':this.response,
			'path_array':this.path_array,
			'_GET':this._GET,
			'_POST':this._POST,
			'cookies':this.cookies,
		});
	}
}