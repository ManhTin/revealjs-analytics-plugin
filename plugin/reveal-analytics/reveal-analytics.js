!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).RevealAnalytics=t()}(this,(function(){"use strict";const e="INTERNAL",t="EXTERNAL",n="AUDIO",i="VIDEO",o="PLAY",s="PAUSE",r="START",a="COMPLETE",l={apiConfig:{},dwellTimes:!0,links:!0,media:!0,slideTransitions:!0,revealDependencies:{quiz:!1},optOut:{popupDelay:1e3},debug:!1};class c{constructor(e={}){this.config={popupDelay:1e3,...e},this.popup=null,this.trackingAllowed=!0,this.initialized=!1}init(){return this.initialized||(setTimeout((()=>this.showPopup()),this.config.popupDelay),this.initialized=!0),this.trackingAllowed}showPopup(){this.popup=document.createElement("div"),this.popup.className="reveal-analytics-popup",this.popup.innerHTML='\n      <span class="reveal-tracking-close">&times;</span>\n      <p>This presentation uses analytics to improve content. No personal data is collected.</p>\n      <div class="reveal-analytics-buttons">\n        <button class="reveal-analytics-btn reveal-tracking-decline">Opt Out</button>\n        <button class="reveal-analytics-btn reveal-tracking-accept">Accept</button>\n      </div>\n    ',this.popup.querySelector(".reveal-tracking-close").addEventListener("click",(()=>{this.acceptTracking()})),this.popup.querySelector(".reveal-tracking-accept").addEventListener("click",(()=>{this.acceptTracking()})),this.popup.querySelector(".reveal-tracking-decline").addEventListener("click",(()=>{this.optOut()})),document.body.appendChild(this.popup)}acceptTracking(){this.trackingAllowed=!0,this.closePopup()}optOut(){this.trackingAllowed=!1,this.closePopup()}closePopup(){this.popup?.parentNode&&(this.popup.parentNode.removeChild(this.popup),this.popup=null)}isTrackingAllowed(){return this.trackingAllowed}}
/*!
   * reveal-analytics plugin v1.0.0
   * Manh Tin Nguyen
   * MIT licensed
   *
   * Copyright (C) 2025 Manh Tin Nguyen
   */class d{constructor(){this.seconds=0}start(){this.timer?console.log("The timer is already running."):this.timer=setInterval((()=>{this.seconds++}),1e3)}reset(){this.clear(),this.start()}clear(){this.timer&&(clearInterval(this.timer),this.timer=void 0),this.seconds=0}getTime(){return this.seconds}toString(){const e=Math.floor(this.seconds/3600),t=Math.floor(this.seconds%3600/60),n=this.seconds%60;return`${e>9?e:`0${e}`}:${t>9?t:`0${t}`}:${n>9?n:`0${n}`}`}}const p=e=>Reveal.getSlides().indexOf(e)+1,u=e=>!0===e.dwellTimes||e.dwellTimes.total,g=e=>!0===e.dwellTimes||e.dwellTimes.perSlide,h=e=>!0===e.links||e.links.internal,m=e=>!0===e.links||e.links.external,v=e=>!0===e.media||e.media.audio,f=e=>!0===e.media||e.media.video,w=(e,t)=>{if(!v(e)&&!f(e))return;const r=()=>{const r=(e=>document.querySelectorAll(v(e)&&f(e)?"audio, video":v(e)?"audio":"video"))(e),a=Reveal.getCurrentSlide();for(const l of r){const r={mediaId:l.id,mediaType:"AUDIO"===l.tagName?n:i,presentationId:e.apiConfig.presentationId,presentationUrl:window.location.href.replace(/(#(.+)?)/,"")};l.onplay||(l.onplay=function(){t.push({timestamp:(new Date).toISOString(),actionType:o,slideNumber:p(a),mediaSource:this.currentSrc,currentTime:Number.parseInt(this.currentTime,10),totalDuration:Number.parseInt(this.duration,10),...r}),e.debug&&console.log("🚀 Media played:",t)}),l.onpause||(l.onpause=function(){t.push({timestamp:(new Date).toISOString(),actionType:s,slideNumber:p(a),mediaSource:this.currentSrc,currentTime:Number.parseInt(this.currentTime,10),totalDuration:Number.parseInt(this.duration,10),progress:this.currentTime/this.duration,finished:this.ended,...r})})}};Reveal.addEventListener("ready",r),Reveal.addEventListener("fragmentshown",r),Reveal.addEventListener("fragmenthidden",r),Reveal.addEventListener("slidechanged",r)};return()=>{const n={...l,...Reveal.getConfig().revealAnalytics},i={logPresentationStartEvents:[],logPresentationCloseEvents:[],logSlideViewEvents:[],logLinkActionEvents:[],logMediaActionEvents:[],logQuizActionEvents:[]},o=new c(n.optOut);if(!n.apiConfig.trackingAPI)return console.error("You have no trackingAPI configured where to send tracking data to!"),null;const s=new d,v=new d,f=()=>{((e,t)=>{Reveal.on("ready",(n=>{const i=Reveal.getCurrentSlide();t.push({presentationId:e.apiConfig.presentationId,presentationUrl:window.location.href.replace(/(#(.+)?)/,""),timestamp:(new Date).toISOString(),slideNumber:p(i)})}))})(n,i.logPresentationStartEvents),((e,t,n)=>{g(e)&&Reveal.addEventListener("slidechanged",(i=>{i.previousSlide&&(t.push({presentationId:e.apiConfig.presentationId,presentationUrl:window.location.href.replace(/(#(.+)?)/,""),timestamp:(new Date).toISOString(),slideNumber:p(i.previousSlide),dwellTime:n.getTime()}),n.reset())}))})(n,i.logSlideViewEvents,v),((e,{logPresentationStartEvents:t,logPresentationCloseEvents:n,logSlideViewEvents:i,logLinkActionEvents:o,logMediaActionEvents:s,logQuizActionEvents:r},a,l)=>{window.addEventListener("beforeunload",(()=>{const c=Reveal.getCurrentSlide(),d=window.location.href.replace(/(#(.+)?)/,"");n.push({presentationId:e.apiConfig.presentationId,presentationUrl:d,slideNumber:p(c),timestamp:(new Date).toISOString(),finalProgress:Reveal.getProgress(),totalDwellTime:u(e)?a.getTime():null});const g={logPresentationStartEvents:t,logPresentationCloseEvents:n,logSlideViewEvents:i,logLinkActionEvents:o,logMediaActionEvents:s,logQuizActionEvents:r};e.debug&&console.log("🚀 ~ sending events:",g),l.isTrackingAllowed()&&navigator.sendBeacon(e.apiConfig.trackingAPI,JSON.stringify(g))}))})(n,i,s,o),((n,i)=>{(h(n)||m(n))&&document.addEventListener("click",(o=>{const s=Reveal.getCurrentSlide();if(!Array.from(s.querySelectorAll("a")).includes(o.target))return;const r=window.location.href.replace(new RegExp(window.location.hash)||"",""),a=o.target.href.replace(r,""),l=a.startsWith("#");if(l&&h(n)||!l&&m(n)){const r=l?e:t,c=l?a:o.target.href;i.push({presentationId:n.apiConfig.presentationId,presentationUrl:window.location.href.replace(/(#(.+)?)/,""),timestamp:(new Date).toISOString(),slideNumber:p(s),linkType:r,linkUrl:c,linkText:o.target.text.trim()})}}))})(n,i.logLinkActionEvents),w(n,i.logMediaActionEvents),((e,t)=>{if(!e.revealDependencies.quiz)return;const n={},i=Reveal.getConfig().quiz||{};i.events=i.events||{};const o=()=>{const i=Reveal.getCurrentSlide(),o=i.querySelector("[data-quiz]");if(!o)return!0;const s=o.dataset.quiz,a=window[s];if(!a)return!0;n[s]instanceof d?n[s].reset():(n[s]=new d,n[s].start());const l={quizId:s,quizName:a.info.name,numberOfQuestions:a.questions.length,presentationId:e.apiConfig.presentationId,presentationUrl:window.location.href.replace(/(#(.+)?)/,"")};return t.push({timestamp:(new Date).toISOString(),slideNumber:p(i),actionType:r,...l}),!0},s=i=>{const o=Reveal.getCurrentSlide(),s=o.querySelector("[data-quiz]");if(!s)return!0;const r=s.dataset.quiz,l=window[r];if(!l)return!0;let c;n[r]instanceof d&&(c=n[r].getTime(),n[r].clear());const u={quizId:r,quizName:l.info.name,numberOfQuestions:l.questions.length,presentationId:e.apiConfig.presentationId,presentationUrl:window.location.href.replace(/(#(.+)?)/,"")};return t.push({timestamp:(new Date).toISOString(),actionType:a,slideNumber:p(o),dwellTime:c,completed:!0,score:i.score/l.questions.length,...u}),!0};if(i.events.onStartQuiz){const e=i.events.onStartQuiz;i.events.onStartQuiz=()=>{o(),e()}}else i.events.onStartQuiz=o;if(i.events.onCompleteQuiz){const e=i.events.onCompleteQuiz;i.events.onCompleteQuiz=t=>{s(t),e(t)}}else i.events.onCompleteQuiz=s;"function"==typeof prepareQuizzes&&prepareQuizzes(i)})(n,i.logQuizActionEvents)};return{id:"reveal-analytics",init:()=>{n.optOut&&function(){const e=document.createElement("link");e.rel="stylesheet",e.type="text/css",e.href="plugin/reveal-analytics/css/opt-out.css",document.head.appendChild(e),o.init()}(),f(),s.start(),g(n)&&v.start(),n.debug&&(console.log("Initialized reveal-analytics plugin"),console.log("Plugin Config:",n),console.log("Tracking allowed:",o.isTrackingAllowed()))}}}}));
