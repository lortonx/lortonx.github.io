// ==UserScript==
// @name         Delta v4
// @version      5.2
// @description  9999999 in 1
// @namespace    delta.agar
// @author       neo
// @match        *://agar.io/*
// @run-at       document-start
// @connect      cdn.ogario.ovh
// @connect      ogar.io
// @connect      deltav4.glitch.me
// @connect      hslo.io
// @connect		 www.agartool.io
// @connect		 imasters.org.ru
// @connect      legendmod.ml
// @connect      127.0.0.1
// @connect		 ogar.ovh
// @grant        GM.xmlHttpRequest
// ==/UserScript==

if (location.host == 'agar.io' && location.pathname === '/' ) {
    location.href = 'https://agar.io/delta';
    return;
  }
  
  var mode = location.pathname.slice(1)
  var url;
  switch(mode){
      case 'github':
          url = 'https://deltav4.glitch.me/generatum.html'
          break;
      case 'dev2': url = 'http://127.0.0.1:5500/deltav4.com/ext/index.html'
          break;
      case 'ogario':
          url = 'https://cdn.ogario.ovh/v4/beta/'
          break;
      case 'delta':
          url = 'https://deltav4.glitch.me/v4/index.html'
          break;
      case 'remade-delta':
          url = 'https://deltav4.glitch.me/remade-delta/index.html'
          break;
      case 'dev': url = 'http://ogar.ovh/index.html'
          break;
      case 'hslo':
          window.stop();
          document.documentElement.innerHTML = "";
          url = null
          GM.xmlHttpRequest({
              method : "GET",
              url : 'https://hslo.io/install.user.js',
              onload : function(e) {
                 new Function(['GM_info, GM_xmlhttpRequest'],e.responseText)(GM.info, GM.xmlHttpRequest)
              }
          });
          break;
      case 'at':case 'at/':case 'agartool':case 'agartool/':
          window.stop();
          document.documentElement.innerHTML = "";
          url = null
          GM.xmlHttpRequest({
              method : "GET",
              url : 'https://www.agartool.io/agartool.user.js',
              onload : function(e) {
                 new Function(e.responseText)()
              }
          });
          break;
      case 'va':case 'vanilla':case 'va/':case 'vanilla/':
          document.documentElement.innerHTML = "";
          url = null
          GM.xmlHttpRequest({
              method : "GET",
              url : 'http://imasters.org.ru/agar/js/vanilla.user.js',
              onload : function(e) {
                 new Function(e.responseText)()
              }
          });
      break;
      case 'legendmod':
      case 'lm':
          window.stop();
          document.documentElement.innerHTML = "";
          url = null
          GM.xmlHttpRequest({
              method : "GET",
              url : 'https://legendmod.ml/LMexpress/LMexpress.user.js',
              onload : function(e) {
                 new Function(['GM_info, GM_xmlhttpRequest'],e.responseText)(GM.info, GM.xmlHttpRequest)
              }
          });
          break;
      default: url = 'https://deltav4.glitch.me/v4/index.html'
          console.log(mode)
  
  }
  
  
  
  document.documentElement.innerHTML = "Loading";
  if(mode=='none'){
      document.open();
      document.write('Hello');
      document.close();
  }else{
      GM.xmlHttpRequest({
          method: "GET",
          url: url,
          onload: function(e) {
              var D       = window.document;
              var newDoc  = D.implementation.createHTMLDocument();
              D.replaceChild (
                D.importNode (newDoc.documentElement, true),
                D.documentElement
              );
              document.open();
              document.write(e.response);
              document.close();
  
          }
      });
  }
  
  
  
  
  
  