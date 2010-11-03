/*!
	PURE Unobtrusive Rendering Engine for HTML

	Licensed under the MIT licenses.
	More information at: http://www.opensource.org

	Copyright (c) 2010 Michael Cvilic - BeeBole.com

	Thanks to Rog Peppe for the functional JS jump
	revision: 2.46
	 	*/

	
	var $p,pure=$p=function(){var sel=arguments[0],ctxt=false;if(typeof sel==='string'){ctxt=arguments[1]||false;}
	return $p.core(sel,ctxt);};$p.core=function(sel,ctxt,plugins){var plugins=getPlugins(),templates=[];switch(typeof sel){case'string':templates=plugins.find(ctxt||document,sel);if(templates.length===0){error('The template "'+sel+'" was not found');}
	break;case'undefined':error('The template root is undefined, check your selector');break;default:templates=[sel];}
	for(var i=0,ii=templates.length;i<ii;i++){plugins[i]=templates[i];}
	plugins.length=ii;var Sig='_s'+Math.floor(Math.random()*1000000)+'_',attPfx='_a'+Math.floor(Math.random()*1000000)+'_',selRx=/^(\+)?([^\@\+]+)?\@?([^\+]+)?(\+)?$/,autoAttr={IMG:'src',INPUT:'value'},isArray=Array.isArray?function(o){return Array.isArray(o);}:function(o){return Object.prototype.toString.call(o)==="[object Array]";};return plugins;function error(e){if(typeof console!=='undefined'){console.log(e);debugger;}else{alert(e);}
	throw('pure error: '+e);}
	function getPlugins(){var plugins=$p.plugins,f=function(){};f.prototype=plugins;f.prototype.compile=plugins.compile||compile;f.prototype.render=plugins.render||render;f.prototype.autoRender=plugins.autoRender||autoRender;f.prototype.find=plugins.find||find;f.prototype._compiler=compiler;f.prototype._error=error;return new f();}
	function outerHTML(node){return node.outerHTML||(function(n){var div=document.createElement('div'),h;div.appendChild(n.cloneNode(true));h=div.innerHTML;div=null;return h;})(node);}
	function wrapquote(qfn,f){return function(ctxt){return qfn(''+f.call(ctxt.context,ctxt));};}
	function find(n,sel){if(typeof n==='string'){sel=n;n=false;}
	if(typeof document.querySelectorAll!=='undefined'){return(n||document).querySelectorAll(sel);}else{error('You can test PURE standalone with: iPhone, FF3.5+, Safari4+ and IE8+\n\nTo run PURE on your browser, you need a JS library/framework with a CSS selector engine');}}
	function concatenator(parts,fns){return function(ctxt){var strs=[parts[0]],n=parts.length,fnVal,pVal,attLine,pos;for(var i=1;i<n;i++){fnVal=fns[i](ctxt);pVal=parts[i];if(fnVal===''){attLine=strs[strs.length-1];if((pos=attLine.search(/[\w]+=\"?$/))>-1){strs[strs.length-1]=attLine.substring(0,pos);pVal=pVal.substr(1);}}
	strs[strs.length]=fnVal;strs[strs.length]=pVal;}
	return strs.join('');};}
	function parseloopspec(p){var m=p.match(/^(\w+)\s*<-\s*(\S+)?$/);if(m===null){error('bad loop spec: "'+p+'"');}
	if(m[1]==='item'){error('"item<-..." is a reserved word for the current running iteration.\n\nPlease choose another name for your loop.');}
	if(!m[2]||(m[2]&&(/context/i).test(m[2]))){m[2]=function(ctxt){return ctxt.context;};}
	return{name:m[1],sel:m[2]};}
	function dataselectfn(sel){if(typeof(sel)==='function'){return sel;}
	var m=sel.match(/^[a-zA-Z\$_][\w\$:-]*(\.[\w\$:-]*[^\.])*$/);if(m===null){var found=false,s=sel,parts=[],pfns=[],i=0,retStr;if(/\'|\"/.test(s.charAt(0))){if(/\'|\"/.test(s.charAt(s.length-1))){retStr=s.substring(1,s.length-1);return function(){return retStr;};}}else{while((m=s.match(/#\{([^{}]+)\}/))!==null){found=true;parts[i++]=s.slice(0,m.index);pfns[i]=dataselectfn(m[1]);s=s.slice(m.index+m[0].length,s.length);}}
	if(!found){error('bad data selector syntax: '+sel);}
	parts[i]=s;return concatenator(parts,pfns);}
	m=sel.split('.');return function(ctxt){var data=ctxt.context;if(!data){return'';}
	var v=ctxt[m[0]],i=0;if(v&&v.item){data=v.item;i+=1;}
	var n=m.length;for(;i<n;i++){if(!data){break;}
	data=data[m[i]];}
	return(!data&&data!==0)?'':data;};}
	function gettarget(dom,sel,isloop){var osel,prepend,selector,attr,append,target=[];if(typeof sel==='string'){osel=sel;var m=sel.match(selRx);if(!m){error('bad selector syntax: '+sel);}
	prepend=m[1];selector=m[2];attr=m[3];append=m[4];if(selector==='.'||(!selector&&attr)){target[0]=dom;}else{target=plugins.find(dom,selector);}
	if(!target||target.length===0){return error('The node "'+sel+'" was not found in the template');}}else{prepend=sel.prepend;attr=sel.attr;append=sel.append;target=[dom];}
	if(prepend||append){if(prepend&&append){error('append/prepend cannot take place at the same time');}else if(isloop){error('no append/prepend/replace modifiers allowed for loop target');}else if(append&&isloop){error('cannot append with loop (sel: '+osel+')');}}
	var setstr,getstr,quotefn,isStyle,isClass,attName,setfn;if(attr){isStyle=(/^style$/i).test(attr);isClass=(/^class$/i).test(attr);attName=isClass?'className':attr;setstr=function(node,s){node.setAttribute(attPfx+attr,s);if(attName in node&&!isStyle){node[attName]='';}
	if(node.nodeType===1){node.removeAttribute(attr);isClass&&node.removeAttribute(attName);}};if(isStyle||isClass){if(isStyle){getstr=function(n){return n.style.cssText;};}else{getstr=function(n){return n.className;};}
	quotefn=function(s){return s.replace(/\"/g,'&quot;');};}else{getstr=function(n){return n.getAttribute(attr);};quotefn=function(s){return s.replace(/\"/g,'&quot;').replace(/\s/g,'&nbsp;');};}
	if(prepend){setfn=function(node,s){setstr(node,s+getstr(node));};}else if(append){setfn=function(node,s){setstr(node,getstr(node)+s);};}else{setfn=function(node,s){setstr(node,s);};}}else{if(isloop){setfn=function(node,s){var pn=node.parentNode;if(pn){pn.insertBefore(document.createTextNode(s),node.nextSibling);pn.removeChild(node);}};}else{if(prepend){setfn=function(node,s){node.insertBefore(document.createTextNode(s),node.firstChild);};}else if(append){setfn=function(node,s){node.appendChild(document.createTextNode(s));};}else{setfn=function(node,s){while(node.firstChild){node.removeChild(node.firstChild);}
	node.appendChild(document.createTextNode(s));};}}
	quotefn=function(s){return s;};}
	return{attr:attr,nodes:target,set:setfn,sel:osel,quotefn:quotefn};}
	function setsig(target,n){var sig=Sig+n+':';for(var i=0;i<target.nodes.length;i++){target.set(target.nodes[i],sig);}}
	function loopfn(name,dselect,inner,sorter,filter){return function(ctxt){var a=dselect(ctxt),old=ctxt[name],temp={items:a},filtered=0,length,strs=[],buildArg=function(idx,temp,ftr,len){ctxt.pos=temp.pos=idx;ctxt.item=temp.item=a[idx];ctxt.items=a;typeof len!=='undefined'&&(ctxt.length=len);if(typeof ftr==='function'&&ftr(ctxt)===false){filtered++;return;}
	strs.push(inner.call(temp,ctxt));};ctxt[name]=temp;if(isArray(a)){length=a.length||0;if(typeof sorter==='function'){a.sort(sorter);}
	for(var i=0,ii=length;i<ii;i++){buildArg(i,temp,filter,length-filtered);}}else{if(a&&typeof sorter!=='undefined'){error('sort is only available on arrays, not objects');}
	for(var prop in a){a.hasOwnProperty(prop)&&buildArg(prop,temp,filter);}}
	typeof old!=='undefined'?ctxt[name]=old:delete ctxt[name];return strs.join('');};}
	function loopgen(dom,sel,loop,fns){var already=false,ls,sorter,filter,prop;for(prop in loop){if(loop.hasOwnProperty(prop)){if(prop==='sort'){sorter=loop.sort;continue;}else if(prop==='filter'){filter=loop.filter;continue;}
	if(already){error('cannot have more than one loop on a target');}
	ls=prop;already=true;}}
	if(!ls){error('Error in the selector: '+sel+'\nA directive action must be a string, a function or a loop(<-)');}
	var dsel=loop[ls];if(typeof(dsel)==='string'||typeof(dsel)==='function'){loop={};loop[ls]={root:dsel};return loopgen(dom,sel,loop,fns);}
	var spec=parseloopspec(ls),itersel=dataselectfn(spec.sel),target=gettarget(dom,sel,true),nodes=target.nodes;for(i=0;i<nodes.length;i++){var node=nodes[i],inner=compiler(node,dsel);fns[fns.length]=wrapquote(target.quotefn,loopfn(spec.name,itersel,inner,sorter,filter));target.nodes=[node];setsig(target,fns.length-1);}}
	function getAutoNodes(n,data){var ns=n.getElementsByTagName('*'),an=[],openLoops={a:[],l:{}},cspec,isNodeValue,i,ii,j,jj,ni,cs,cj;for(i=-1,ii=ns.length;i<ii;i++){ni=i>-1?ns[i]:n;if(ni.nodeType===1&&ni.className!==''){cs=ni.className.split(' ');for(j=0,jj=cs.length;j<jj;j++){cj=cs[j];cspec=checkClass(cj,ni.tagName);if(cspec!==false){isNodeValue=(/nodevalue/i).test(cspec.attr);if(cspec.sel.indexOf('@')>-1||isNodeValue){ni.className=ni.className.replace('@'+cspec.attr,'');if(isNodeValue){cspec.attr=false;}}
	an.push({n:ni,cspec:cspec});}}}}
	return an;function checkClass(c,tagName){var ca=c.match(selRx),attr=ca[3]||autoAttr[tagName],cspec={prepend:!!ca[1],prop:ca[2],attr:attr,append:!!ca[4],sel:c},i,ii,loopi,loopil,val;for(i=openLoops.a.length-1;i>=0;i--){loopi=openLoops.a[i];loopil=loopi.l[0];val=loopil&&loopil[cspec.prop];if(typeof val!=='undefined'){cspec.prop=loopi.p+'.'+cspec.prop;if(openLoops.l[cspec.prop]===true){val=val[0];}
	break;}}
	if(typeof val==='undefined'){val=isArray(data)?data[0][cspec.prop]:data[cspec.prop];if(typeof val==='undefined'){return false;}}
	if(isArray(val)){openLoops.a.push({l:val,p:cspec.prop});openLoops.l[cspec.prop]=true;cspec.t='loop';}else{cspec.t='str';}
	return cspec;}}
	function compiler(dom,directive,data,ans){var fns=[];ans=ans||data&&getAutoNodes(dom,data);if(data){var j,jj,cspec,n,target,nodes,itersel,node,inner;while(ans.length>0){cspec=ans[0].cspec;n=ans[0].n;ans.splice(0,1);if(cspec.t==='str'){target=gettarget(n,cspec,false);setsig(target,fns.length);fns[fns.length]=wrapquote(target.quotefn,dataselectfn(cspec.prop));}else{itersel=dataselectfn(cspec.sel);target=gettarget(n,cspec,true);nodes=target.nodes;for(j=0,jj=nodes.length;j<jj;j++){node=nodes[j];inner=compiler(node,false,data,ans);fns[fns.length]=wrapquote(target.quotefn,loopfn(cspec.sel,itersel,inner));target.nodes=[node];setsig(target,fns.length-1);}}}}
	var target,dsel;for(var sel in directive){if(directive.hasOwnProperty(sel)){dsel=directive[sel];if(typeof(dsel)==='function'||typeof(dsel)==='string'){target=gettarget(dom,sel,false);setsig(target,fns.length);fns[fns.length]=wrapquote(target.quotefn,dataselectfn(dsel));}else{loopgen(dom,sel,dsel,fns);}}}
	var h=outerHTML(dom),pfns=[];h=h.replace(/<([^>]+)\s(value\=""|selected)\s?([^>]*)>/ig,"<$1 $3>");h=h.split(attPfx).join('');var parts=h.split(Sig),p;for(var i=1;i<parts.length;i++){p=parts[i];pfns[i]=fns[parseInt(p,10)];parts[i]=p.substring(p.indexOf(':')+1);}
	return concatenator(parts,pfns);}
	function compile(directive,ctxt,template){var rfn=compiler((template||this[0]).cloneNode(true),directive,ctxt);return function(context){return rfn({context:context});};}
	function render(ctxt,directive){var fn=typeof directive==='function'?directive:plugins.compile(directive,false,this[0]);for(var i=0,ii=this.length;i<ii;i++){this[i]=replaceWith(this[i],fn(ctxt,false));}
	context=null;return this;}
	function autoRender(ctxt,directive){var fn=plugins.compile(directive,ctxt,this[0]);for(var i=0,ii=this.length;i<ii;i++){this[i]=replaceWith(this[i],fn(ctxt,false));}
	context=null;return this;}
	function replaceWith(elm,html){var ne,ep=elm.parentNode,depth=0;switch(elm.tagName){case'TBODY':case'THEAD':case'TFOOT':html='<TABLE>'+html+'</TABLE>';depth=1;break;case'TR':html='<TABLE><TBODY>'+html+'</TBODY></TABLE>';depth=2;break;case'TD':case'TH':html='<TABLE><TBODY><TR>'+html+'</TR></TBODY></TABLE>';depth=3;break;}
	tmp=document.createElement('SPAN');tmp.style.display='none';document.body.appendChild(tmp);tmp.innerHTML=html;ne=tmp.firstChild;while(depth--){ne=ne.firstChild;}
	ep.insertBefore(ne,elm);ep.removeChild(elm);document.body.removeChild(tmp);elm=ne;ne=ep=null;return elm;}};$p.plugins={};$p.libs={dojo:function(){if(typeof document.querySelector==='undefined'){$p.plugins.find=function(n,sel){return dojo.query(sel,n);};}},domassistant:function(){if(typeof document.querySelector==='undefined'){$p.plugins.find=function(n,sel){return $(n).cssSelect(sel);};}
	DOMAssistant.attach({publicMethods:['compile','render','autoRender'],compile:function(directive,ctxt){return $p(this).compile(directive,ctxt);},render:function(ctxt,directive){return $($p(this).render(ctxt,directive))[0];},autoRender:function(ctxt,directive){return $($p(this).autoRender(ctxt,directive))[0];}});},jquery:function(){if(typeof document.querySelector==='undefined'){$p.plugins.find=function(n,sel){return jQuery(n).find(sel);};}
	jQuery.fn.extend({compile:function(directive,ctxt){return $p(this[0]).compile(directive,ctxt);},render:function(ctxt,directive){return jQuery($p(this[0]).render(ctxt,directive));},autoRender:function(ctxt,directive){return jQuery($p(this[0]).autoRender(ctxt,directive));}});},mootools:function(){if(typeof document.querySelector==='undefined'){$p.plugins.find=function(n,sel){return $(n).getElements(sel);};}
	Element.implement({compile:function(directive,ctxt){return $p(this).compile(directive,ctxt);},render:function(ctxt,directive){return $p(this).render(ctxt,directive);},autoRender:function(ctxt,directive){return $p(this).autoRender(ctxt,directive);}});},prototype:function(){if(typeof document.querySelector==='undefined'){$p.plugins.find=function(n,sel){n=n===document?n.body:n;return typeof n==='string'?$$(n):$(n).select(sel);};}
	Element.addMethods({compile:function(element,directive,ctxt){return $p(element).compile(directive,ctxt);},render:function(element,ctxt,directive){return $p(element).render(ctxt,directive);},autoRender:function(element,ctxt,directive){return $p(element).autoRender(ctxt,directive);}});},sizzle:function(){if(typeof document.querySelector==='undefined'){$p.plugins.find=function(n,sel){return Sizzle(sel,n);};}},sly:function(){if(typeof document.querySelector==='undefined'){$p.plugins.find=function(n,sel){return Sly(sel,n);};}}};(function(){var libkey=typeof dojo!=='undefined'&&'dojo'||typeof DOMAssistant!=='undefined'&&'domassistant'||typeof jQuery!=='undefined'&&'jquery'||typeof MooTools!=='undefined'&&'mootools'||typeof Prototype!=='undefined'&&'prototype'||typeof Sizzle!=='undefined'&&'sizzle'||typeof Sly!=='undefined'&&'sly';libkey&&$p.libs[libkey]();})();