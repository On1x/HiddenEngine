#!/usr/bin/env node
"use strict";
var fs=require('fs');
var steem=require('steem');
var golos=require('golos-js');
module.exports=class he_watchers{
	constructor(){
		global.he.json_file='./global.json';
		var _this=this;
		if(fs.existsSync(global.he.json_file)){
			var global_buf='';
			var stream=fs.createReadStream(global.he.json_file);
			stream.on('data',function(chunk){
				global_buf+=chunk;
			}).on('end', function(){
				global.he=JSON.parse(global_buf);
				global.he.json_file='./global.json';
				global.he.steem_watch_block_id=0;
				global.he.golos_watch_block_id=0;
				_this.start();
				this.close();
			});
		}
		else{
			global.he.steem_queue=[];
			global.he.steem_queue.push();
			global.he.golos_queue=[];
			global.he.golos_queue.push();
			global.he.accounts=[];
			global.he.counters={};
			global.he.steem_watch_block_id=0;
			global.he.golos_watch_block_id=0;
			global.he.counters.accounts=0;
			global.he.counters.steem_queue=0;
			global.he.counters.golos_queue=0;
			global.he.admin={'login':'admin','password':'admin'};
			global.he.watch_manager={'steem':1,'golos':1,'save_global':1};
			_this.start();
		}
	}
	start(){
		this.restart_golos_watch(true);
		this.restart_steem_watch(true);
		this.save_global_watch();
		this.golos_queue();
		this.steem_queue();
	}
	restart_golos_watch(wait){
		var _this=this;
		if(wait){
			if(0==global.he.watch_manager.golos){
				setTimeout(function(){_this.restart_golos_watch(wait)},5000);
			}
			if(1==global.he.watch_manager.golos){
				setTimeout(function(){_this.restart_golos_watch(false)},1000);
				setTimeout(function(){_this.golos_watch()},2000);
			}
			if(2==global.he.watch_manager.golos){
				setTimeout(function(){_this.restart_golos_watch(false)},1000);
			}
		}
		else{
			if(0==global.he.watch_manager.golos){
				golos.api.getDynamicGlobalProperties(function(err,result) {
					if(!err){
						global.he.golos_watch_block_id=result.head_block_number;
						console.log('Starting Golos Watch... on block: #'+global.he.golos_watch_block_id);
						global.he.watch_manager.golos=1;
						setTimeout(function(){_this.golos_watch()},1000);
					}
				});
			}
			if(1==global.he.watch_manager.golos){
				golos.api.getDynamicGlobalProperties(function(err,result) {
					if(!err){
						global.he.golos_watch_block_id=result.head_block_number;
						console.log('Restarting Golos Watch... on block: #'+global.he.golos_watch_block_id);
					}
				});
			}
			if(2==global.he.watch_manager.golos){
				global.he.watch_manager.golos=1;
				if(0==global.he.golos_watch_block_id){
					global.he.golos_watch_block_id=1;
				}
				console.log('Continue Golos Watch... on block: #'+global.he.golos_watch_block_id);
				setTimeout(function(){_this.golos_watch()},1000);
			}
		}
	}
	restart_steem_watch(wait){
		var _this=this;
		if(wait){
			if(0==global.he.watch_manager.steem){
				setTimeout(function(){_this.restart_steem_watch(wait)},5000);
			}
			if(1==global.he.watch_manager.steem){
				setTimeout(function(){_this.restart_steem_watch(false)},1000);
				setTimeout(function(){_this.steem_watch()},2000);
			}
			if(2==global.he.watch_manager.steem){
				setTimeout(function(){_this.restart_steem_watch(false)},1000);
			}
		}
		else{
			if(0==global.he.watch_manager.steem){
				steem.api.getDynamicGlobalProperties(function(err,result) {
					if(!err){
						global.he.steem_watch_block_id=result.head_block_number;
						console.log('Starting Steem Watch... on block: #'+global.he.steem_watch_block_id);
						global.he.watch_manager.steem=1;
						setTimeout(function(){_this.steem_watch()},1000);
					}
				});
			}
			if(1==global.he.watch_manager.steem){
				steem.api.getDynamicGlobalProperties(function(err,result) {
					if(!err){
						global.he.steem_watch_block_id=result.head_block_number;
						console.log('Restarting Steem Watch... on block: #'+global.he.steem_watch_block_id);
					}
				});
			}
			if(2==global.he.watch_manager.steem){
				global.he.watch_manager.steem=1;
				if(0==global.he.steem_watch_block_id){
					global.he.steem_watch_block_id=1;
				}
				console.log('Continue Steem Watch... on block: #'+global.he.steem_watch_block_id);
				setTimeout(function(){_this.steem_watch()},1000);
			}
		}
	}
	save_global_watch(){
		var _this=this;
		if(1==global.he.watch_manager.save_global){
			var stream=fs.createWriteStream(global.he.json_file,{flags:'w'});
			stream.write(JSON.stringify(global.he));
			stream.on('finish',function(){
				global.he.watch_manager.save_global=0;
				this.close();
			});
		}
		setTimeout(function(){_this.save_global_watch()},30000);
	}
	golos_watch(){
		var _this=this;
		if(1!=global.he.watch_manager.golos){
			console.log('Stopping Golos Watch... on block: #'+global.he.golos_watch_block_id);
			this.restart_golos_watch(true);
		}
		if(1==global.he.watch_manager.golos){
			golos.api.getBlock(global.he.golos_watch_block_id,function(err,result){
				if(null!=result){
					console.log('Golos Watch: fetching block #'+global.he.golos_watch_block_id);
					for(var i in result.transactions){
						for(var j in result.transactions[i].operations){
							var op_name=result.transactions[i].operations[j][0];
							var op_data=result.transactions[i].operations[j][1];
							if('comment'==op_name){
								if(''==op_data.parent_author){
									if(_this.look_in_accounts(op_data.author,2)){
										console.log('Found new post by @'+op_data.author+', apply upvote circle...');
										for(var account of global.he.accounts){
											if(2==account.type){
												if((typeof account.upvote_circle !== 'undefined')&&(1==account.upvote_circle)){
													if(typeof account.posting_key !== 'undefined'){
														var queue_item={'action':'vote','data':{'user_login':account.login,'user_posting_key':account.posting_key,'target_login':op_data.author,'target_permlink':op_data.permlink,'vote_weight':10000}};
														queue_item.id=++global.he.counters.golos_queue;
														global.he.golos_queue.push(queue_item);
													}
												}
											}
										}
									}
								}
							}
						}
					}
					global.he.golos_watch_block_id=global.he.golos_watch_block_id+1;
				}
			});
			setTimeout(function(){_this.golos_watch()},1000);
		}
	}
	look_in_accounts(login,type){
		var found=false;
		for(var m of global.he.accounts){
			if(type==m.type){
				if(login==m.login){
					found=true;
				}
			}
		}
		return found;
	}
	steem_watch(){
		if(1!=global.he.watch_manager.steem){
			console.log('Stopping Steem Watch... on block: #'+global.he.steem_watch_block_id);
			this.restart_steem_watch(true);
		}
		if(1==global.he.watch_manager.steem){
			var _this=this;
			steem.api.getBlock(global.he.steem_watch_block_id,function(err,result){
				if(null!=result){
					console.log('Steem Watch: fetching block #'+global.he.steem_watch_block_id);
					for(var i in result.transactions){
						for(var j in result.transactions[i].operations){
							var op_name=result.transactions[i].operations[j][0];
							var op_data=result.transactions[i].operations[j][1];
							if('comment'==op_name){
								if(''==op_data.parent_author){
									if(_this.look_in_accounts(op_data.author,1)){
										console.log('Found new post by @'+op_data.author+', apply upvote circle...');
										for(var account of global.he.accounts){
											if(1==account.type){
												if((typeof account.upvote_circle !== 'undefined')&&(1==account.upvote_circle)){
													if(typeof account.posting_key !== 'undefined'){
														var queue_item={'action':'vote','data':{'user_login':account.login,'user_posting_key':account.posting_key,'target_login':op_data.author,'target_permlink':op_data.permlink,'vote_weight':10000}};
														queue_item.id=++global.he.counters.steem_queue;
														global.he.steem_queue.push(queue_item);
													}
												}
											}
										}
									}
								}
							}
						}
					}
					global.he.steem_watch_block_id=global.he.steem_watch_block_id+1;
				}
			});
			setTimeout(function(){_this.steem_watch()},1000);
		}
	}

	/*
	queue struct:
	id
	action=vote,flag,witness_vote,witness_unvote
	data{
		user_login
		user_posting_key
		user_active_key
		target_login
		target_permlink
		vote_weight=10000
		flag_weight=10000
	}
	*/
	golos_queue(){
		var _this=this;
		if(typeof global.he.golos_queue !== 'undefined'){
			for(var i in global.he.golos_queue){
				var queue_item_remove=false;
				if('vote'==global.he.golos_queue[i].action){
					console.log('Golos queue action #'+global.he.golos_queue[i].id+': '+global.he.golos_queue[i].action+', by user: '+global.he.golos_queue[i].data.user_login);
					golos.broadcast.vote(global.he.golos_queue[i].data.user_posting_key,global.he.golos_queue[i].data.user_login,global.he.golos_queue[i].data.target_login,global.he.golos_queue[i].data.target_permlink,global.he.golos_queue[i].data.vote_weight,function(err, result){});
					queue_item_remove=true;
				}
				if('flag'==global.he.golos_queue[i].action){
					console.log('Golos queue action #'+global.he.golos_queue[i].id+': '+global.he.golos_queue[i].action+', by user: '+global.he.golos_queue[i].data.user_login);
					golos.broadcast.vote(global.he.golos_queue[i].data.user_posting_key,global.he.golos_queue[i].data.user_login,global.he.golos_queue[i].data.target_login,global.he.golos_queue[i].data.target_permlink,-1*global.he.golos_queue[i].data.flag_weight,function(err, result){});
					queue_item_remove=true;
				}
				if('witness_vote'==global.he.golos_queue[i].action){
					console.log('Golos queue action #'+global.he.golos_queue[i].id+': '+global.he.golos_queue[i].action+', by user: '+global.he.golos_queue[i].data.user_login);
					golos.broadcast.accountWitnessVote(global.he.golos_queue[i].data.user_active_key,global.he.golos_queue[i].data.user_login,global.he.golos_queue[i].data.target_login,true,function(err, result){});
					queue_item_remove=true;
				}
				if('witness_unvote'==global.he.golos_queue[i].action){
					console.log('Golos queue action #'+global.he.golos_queue[i].id+': '+global.he.golos_queue[i].action+', by user: '+global.he.golos_queue[i].data.user_login);
					golos.broadcast.accountWitnessVote(global.he.golos_queue[i].data.user_active_key,global.he.golos_queue[i].data.user_login,global.he.golos_queue[i].data.target_login,false,function(err, result){});
					queue_item_remove=true;
				}
				if(queue_item_remove){
					global.he.golos_queue.splice(i,1);
				}
			}
			global.he.watch_manager.save_global=1;
		}
		setTimeout(function(){_this.golos_queue()},10000);
	}
	steem_queue(){
		var _this=this;
		if(typeof global.he.steem_queue !== 'undefined'){
			for(var i in global.he.steem_queue){
				var queue_item_remove=false;
				if('vote'==global.he.steem_queue[i].action){
					console.log('Golos queue action #'+global.he.steem_queue[i].id+': '+global.he.steem_queue[i].action+', by user: '+global.he.steem_queue[i].data.user_login);
					golos.broadcast.vote(global.he.steem_queue[i].data.user_posting_key,global.he.steem_queue[i].data.user_login,global.he.steem_queue[i].data.target_login,global.he.steem_queue[i].data.target_permlink,global.he.steem_queue[i].data.vote_weight,function(err, result){});
					queue_item_remove=true;
				}
				if('flag'==global.he.steem_queue[i].action){
					console.log('Golos queue action #'+global.he.steem_queue[i].id+': '+global.he.steem_queue[i].action+', by user: '+global.he.steem_queue[i].data.user_login);
					golos.broadcast.vote(global.he.steem_queue[i].data.user_posting_key,global.he.steem_queue[i].data.user_login,global.he.steem_queue[i].data.target_login,global.he.steem_queue[i].data.target_permlink,-1*global.he.steem_queue[i].data.flag_weight,function(err, result){});
					queue_item_remove=true;
				}
				if('witness_vote'==global.he.steem_queue[i].action){
					console.log('Golos queue action #'+global.he.steem_queue[i].id+': '+global.he.steem_queue[i].action+', by user: '+global.he.steem_queue[i].data.user_login);
					golos.broadcast.accountWitnessVote(global.he.steem_queue[i].data.user_active_key,global.he.steem_queue[i].data.user_login,global.he.steem_queue[i].data.target_login,true,function(err, result){});
					queue_item_remove=true;
				}
				if('witness_unvote'==global.he.steem_queue[i].action){
					console.log('Golos queue action #'+global.he.steem_queue[i].id+': '+global.he.steem_queue[i].action+', by user: '+global.he.steem_queue[i].data.user_login);
					golos.broadcast.accountWitnessVote(global.he.steem_queue[i].data.user_active_key,global.he.steem_queue[i].data.user_login,global.he.steem_queue[i].data.target_login,false,function(err, result){});
					queue_item_remove=true;
				}
				if(queue_item_remove){
					global.he.steem_queue.splice(i,1);
				}
			}
			global.he.watch_manager.save_global=1;
		}
		setTimeout(function(){_this.steem_queue()},10000);
	}
}