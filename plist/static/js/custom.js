//if console is not defined, e.g., Firebug console is not enabled or Non-Firefox browser
if (typeof console == 'undefined') {
    var console = {};
    console.log = function(msg) {
        return;
    };
}



var _g = _g || {};
google.load("jquery", "1");
google.load("jqueryui", "1");
google.setOnLoadCallback(function() {
	/**
	 * Cookie plugin
	 *
	 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
	 * Dual licensed under the MIT and GPL licenses:
	 * http://www.opensource.org/licenses/mit-license.php
	 * http://www.gnu.org/licenses/gpl.html
	 *
	*/	
	jQuery.cookie=function(name,value,options){if(typeof value!='undefined'){options=options||{};if(value===null){value='';options.expires=-1;}
	var expires='';if(options.expires&&(typeof options.expires=='number'||options.expires.toUTCString)){var date;if(typeof options.expires=='number'){date=new Date();date.setTime(date.getTime()+(options.expires*24*60*60*1000));}else{date=options.expires;}
	expires='; expires='+date.toUTCString();}
	var path=options.path?'; path='+(options.path):'';var domain=options.domain?'; domain='+(options.domain):'';var secure=options.secure?'; secure':'';document.cookie=[name,'=',encodeURIComponent(value),expires,path,domain,secure].join('');}else{var cookieValue=null;if(document.cookie&&document.cookie!=''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=jQuery.trim(cookies[i]);if(cookie.substring(0,name.length+1)==(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}
	return cookieValue;}};	
	/**
	 * jCache - A client cache plugin for jQuery
	 * Should come in handy when data needs to be cached in client to improve performance.
	 * Author: 	Phan Van An 
	 *			phoenixheart@gmail.com
	 *			http://www.skidvn.com
	 * License : Read jQuery's license

	Usage:
	    2.	[OPTIONAL] Set the max cached item number, for example 20
	    	$.jCache.maxSize = 20; 
	    3. 	Start playing around with it:
	    	- Put an item into cache: $.jCache.setItem(theKey, the Value);
	    	- Retrieve an item from cache: var theValue = $.jCache.getItem(theKey);
	    	- ...
	 */

	(function(jQuery){this.version='(beta)(0.0.1)';this.maxSize=10;this.keys=new Array();this.cache_length=0;this.items=new Array();this.setItem=function(pKey,pValue)
	{if(typeof(pValue)!='undefined')
	{if(typeof(this.items[pKey])=='undefined')
	{this.cache_length++;}
	this.keys.push(pKey);this.items[pKey]=pValue;if(this.cache_length>this.maxSize)
	{this.removeOldestItem();}}
	return pValue;}
	this.removeItem=function(pKey)
	{var tmp;if(typeof(this.items[pKey])!='undefined')
	{this.cache_length--;var tmp=this.items[pKey];delete this.items[pKey];}
	return tmp;}
	this.getItem=function(pKey)
	{return this.items[pKey];}
	this.hasItem=function(pKey)
	{return typeof(this.items[pKey])!='undefined';}
	this.removeOldestItem=function()
	{this.removeItem(this.keys.shift());}
	this.clear=function()
	{var tmp=this.cache_length;this.keys=new Array();this.cache_length=0;this.items=new Array();return tmp;}
	jQuery.jCache=this;return jQuery;})(jQuery);	

	_g.tabs = $("#tabs");
	_g.t1 = $('#tabs-1');
	_g.artists = _g.data.topartists.artist;
	_g.tabs.tabs({cookie: { expires: 1 }});
	//html containers
	
	_g.hul = $('<ul></ul>');
	_g.thul = $('<ul></ul>');
	_g.hli = $('<li></li>');
	_g.bplus = $('.plus','#tabs-1');
	_g.bplustemp = $('.temp_','#tabs-1');
	_g.bminusClass= 'ui-icon-circle-minus';
	_g.bplusClass= 'ui-icon-circle-plus';
    _g.cookieopt = { expires: 20 };
    $.jCache.maxSize = 30; 
	_g.badd = $('.add');
	_g.bremove = $('.remove')
	_g.userPLContainer = $('#songs');
	
	
	
	/*
	$.ajax({
	  url: 'plist/',
	  success: function(data) {
			//console.log(data);
			var uplist = createUserList(data);
			//_g.userPLContainer.html(uplist);
			console.log(uplist);
	    }
	});	
	*/
	function createUserList(data){
		var t_li = '';
		//console.log(data);
		$.each(data,function(e){
			//console.log(this);
			if (this.fields.title) {
				t_li += '<li>'
							+'<div class="clearfix">' + naviRemove() 
								+'<div class="grid" rel="'+ this.pk +'">' + this.fields.title + '</div>'
							+'</div>'
						+'</li>';
			}
		});	
		return '<ul>' + t_li + '</ul>';		
	}
	
	_g.badd.live('click',function(e){
		var mbid = $(this).parent().parent().attr('rel'),
			artist = $(this).parent().parent().attr('title'),
			title = $(this).parent().next().html(),
			song = artist + ' - ' + title;
			$.post("save/", { mbid: mbid,song:song} );
			$.ajax({
			  url: 'plist/',
			  success: function(data) {
					var uplist = createUserList(data);
					_g.userPLContainer.html(uplist);
					_g.tabs.tabs({ selected: -1 });
			    }
			});			
	});
	_g.bremove.live('click',function(e){
		var mbid = $(this).parent().next().attr('rel');
		$.post("delete/", { mbid: mbid} );
		$.ajax({
		  url: 'plist/',
		  success: function(data) {
				var uplist = createUserList(data);
				_g.userPLContainer.html(uplist);
		    }
		});			
	});	

	

	_g.bplus.live('click',function(e){
		var trackContainer = $(this).parent().parent().next(),
			artPic = $(this).parent().parent().parent().attr('rel');
		if (!$(this).hasClass(_g.bminusClass)){
			$(this).addClass(_g.bminusClass);
			getTracks(this,artPic);
		}else{
			$(this).removeClass(_g.bminusClass);
			$(trackContainer).slideUp();
		}
	});
	function createItems(){
		var t_li = '';
		$.each(_g.artists,function(e){
			//console.log(e);
			if (this.name) {
				t_li += '<li rel="' + this.image[3]["#text"] + '" class="clearfix" id="item_'+ e + '_' + this.mbid +'">'
							+'<div class="clearfix">' + naviPlus() 
								+'<div class="grid">' + this.name + '</div>'
							+'</div>'
							+'<div class="tracks dn clearfix">'
								+'<div class="grid pic"></div>'
								+'<div class="grid trackList"></div>'
							+'</div>'
						+'</li>';
			}
		});		
		return t_li;
	}
	function getTracks(e,pic){
		var artNameContainer = $(e).parent().next(),
			artName = artNameContainer.html(),
			trackContainer = $(e).parent().parent().next(),
			trackList = trackContainer.children('.trackList'),
			img = '<img src="'+ pic +'" title="'+ artName +'"/>',
			thul = $('<ul class="grid trackList"></ul>'),
			t_li = '';
		if (typeof($.jCache.getItem(artName)) != 'string'){
			$.ajax({
			  url: 'tracks/' + artName,
			  success: function(data) {
					$.each(data.toptracks.track,function(e){
						//console.log(this);
						if (this.name) {
							//console.log(this.artist.name)
							t_li += '<li class="clearfix" id="item_'+ e + '" rel="'+ this.artist.mbid +'" title="'+ this.artist.name +'">'
								 + navi() +'<div class="grid">' + this.name + '</div></li>';
						}
					});
					var ttul = thul.html(t_li);
					trackContainer.children('.pic').html(img);
					trackList.html(ttul);
					trackContainer.show();
					$.jCache.setItem(artName, trackContainer.html());
			    }
			});
		}else{
			trackContainer.show().html($.jCache.getItem(artName));
		}				
	}
	function naviPlus(){
		var navi = '<div class="grid ui-state-default ui-corner-all"><span class="ui-icon ui-icon-circle-plus plus">play</span></div>';
		return navi;
	}
	function naviRemove(){
		var navi = '<div class="grid ui-state-default ui-corner-all"><span class="ui-icon ui-icon-trash remove">Remove</span></div>';
		return navi;
	}	
	function navi(){
		//'<div class="grid ui-state-default ui-corner-all play"><span class="ui-icon ui-icon-play">play</span></div>'
		var navi = '<div class="grid ui-state-default ui-corner-all"><span class="ui-icon ui-icon-heart add">add</span></div>';
		return navi;
	}
	//create list
	_g.tul = _g.hul.html(createItems());
	_g.t1.html(_g.tul);
});