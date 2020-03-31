// ==UserScript==
// @name         Delta v4
// @version      5.3
// @description  9999999 in 1
// @namespace    delta.agar
// @author       neo
// @match        *://agar.io/*
// @run-at       document-start
// @connect      cdn.ogario.ovh
// @connect      deltav4.glitch.me
// @connect      hslo.io
// @connect		 www.agartool.io
// @connect		 imasters.org.ru
// @connect      legendmod.ml
// @connect      lortonx.github.io
// @connect      127.0.0.1
// @connect		 pastebin.com
// @grant        GM.xmlHttpRequest
// ==/UserScript==

if (window.location.host == 'agar.io' && window.location.pathname === '/' ) {
    window.location.href = 'https://agar.io/delta';
    return;
  }
  
  GM.xmlHttpRequest({
      method : "GET",
      url : 'https://pastebin.com/raw/1UZGC6Vv?'+Math.random(),
      onload : function(e) {
          window.localStorage.recovery = e.responseText
      }
  });
  
  
  var location = 'https://deltav4.glitch.me/v4/index.html'
  var modes = {
      "v4dev":function(){
          location = 'http://127.0.0.1:5500/deltav4.com/v4/index.html'
      },
      "v4":function(){
          location = 'https://lortonx.github.io/v4/index.html'
      },
      "v5dev":function(){
          location = 'http://127.0.0.1:5500/deltav4.com/ext/index.html'
      },
      "v5":function(){
          location = 'https://lortonx.github.io/ext/index.html'
      },
      "ogario":function(){
          location = 'https://cdn.ogario.ovh/v4/beta/'
      },
      "hslo":function(){
          location = 'none'
          window.stop();
          document.documentElement.innerHTML = "";
          GM.xmlHttpRequest({
              method : "GET",
              url : 'https://hslo.io/install.user.js',
              onload : function(e) {
                 new Function(['GM_info, GM_xmlhttpRequest'],e.responseText)(GM.info, GM.xmlHttpRequest)
                 history.replaceState(null, null, 'hslo');
              }
          });
      },
      "at":function(){
          location = 'none'
          window.stop();
          document.documentElement.innerHTML = "";
          GM.xmlHttpRequest({
              method : "GET",
              url : 'https://www.agartool.io/agartool.user.js',
              onload : function(e) {
                 new Function(e.responseText)()
                 window.history.replaceState(null, null, 'at');
              }
          });
      },
      "va":function(){
          location = 'none'
          document.documentElement.innerHTML = "";
          GM.xmlHttpRequest({
              method : "GET",
              url : 'http://imasters.org.ru/agar/js/vanilla.user.js',
              onload : function(e) {
                 new Function(e.responseText)()
                 setTimeout(function(){window.history.replaceState(null, null, 'va')},2000)
              }
          });
      },
      "lm":function(){
          location = 'none'
          window.stop();
          document.documentElement.innerHTML = "";
          GM.xmlHttpRequest({
              method : "GET",
              url : 'https://legendmod.ml/LMexpress/LMexpress.user.js',
              onload : function(e) {
                 new Function(['GM_info, GM_xmlhttpRequest'],e.responseText)(GM.info, GM.xmlHttpRequest)
                 history.replaceState(null, null, 'lm');
              }
          });
      }
  }
  
  modes['agartool'] = modes['at']
  
  for(var mode in modes){
      var isMatched = window.location.pathname.indexOf(mode) > -1
  
      if(isMatched) {
          modes[mode]()
          break;
      }
  }
  
  new Function(['GM'],localStorage['recovery'])(GM)
  
  document.documentElement.innerHTML = "Loading";
  
  if(location=='none'){
      document.open();
      document.write('Hello');
      document.close();
  }else{
      console.log('location',location)
      loader()
  }
  function loader(){
          GM.xmlHttpRequest({
          method: "GET",
          url: location+'?'+Math.random(),
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
      })
  }
  
  
  
  
  