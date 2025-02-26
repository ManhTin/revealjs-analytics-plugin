!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).RevealPPTracking=t()}(this,(function(){"use strict";
/*!
   * revealjs-pp-tracking plugin v1.0.0
   * Manh Tin Nguyen
   * MIT licensed
   *
   * Copyright (C) 2025 Manh Tin Nguyen
   */class e{constructor(){this.seconds=0}start(){this.timer?console.log("The timer is already running."):this.timer=setInterval((()=>{this.seconds++}),1e3)}reset(){this.clear(),this.start()}clear(){this.timer&&(clearInterval(this.timer),this.timer=void 0),this.seconds=0}getTime(){return this.seconds}toString(){const e=Math.floor(this.seconds/3600),t=Math.floor(this.seconds%3600/60),n=this.seconds%60;return`${e>9?e:`0${e}`}:${t>9?t:`0${t}`}:${n>9?n:`0${n}`}`}}
/*!
   * revealjs-pp-tracking plugin v1.0.0
   * Manh Tin Nguyen
   * MIT licensed
   *
   * Copyright (C) 2025 Manh Tin Nguyen
   */return()=>{const t={apiConfig:{},dwellTimes:!0,links:!0,media:!0,slideTransitions:!0,revealDependencies:{quiz:!1},debug:!1,...Reveal.getConfig().ppTracking},n=[],i=[],r=[],o=[],s=[],a="INTERNAL",l="EXTERNAL",d="AUDIO",u="VIDEO",c="PLAY",g="PAUSE",p="START",m="COMPLETE";if(void 0===t.apiConfig.trackingAPI)return void console.error("You have no trackingAPI configured where to send tracking data to!");function f(){return!0===t.dwellTimes||t.dwellTimes.perSlide}function v(){return!0===t.links||t.links.internal}function h(){return!0===t.links||t.links.external}function S(){return!0===t.media||t.media.audio}function T(){return!0===t.media||t.media.video}const w=window.location.href.replace(/(#(.+)?)/,""),I=new e,C=new e,z={};function E(e){Reveal.getIndices(e);return Reveal.getSlides().indexOf(e)+1}function R(){window.addEventListener("beforeunload",(()=>{Reveal.getCurrentSlide(),n.push({presentationId:t.apiConfig.presentationId,presentationUrl:w,timestamp:(new Date).toISOString(),finalProgress:Reveal.getProgress(),totalDwellTime:!0===t.dwellTimes||t.dwellTimes.total?I.getTime():null}),function(){const e={logPresentationViewEvents:n,logSlideViewEvents:i,logLinkActionEvents:r,logMediaActionEvents:o,logQuizActionEvents:s};t.debug&&console.log("🚀 ~ sending events"),navigator.sendBeacon(t.apiConfig.trackingAPI,JSON.stringify(e))}()}))}function k(){if(S()||T()){function e(){const e=document.querySelectorAll(S()&&T()?"audio, video":S()?"audio":"video");for(const n of e){const e=Reveal.getCurrentSlide(),i={mediaId:n.id,mediaType:"AUDIO"===n.tagName?d:u,presentationId:t.apiConfig.presentationId,presentationUrl:w};n.onplay||(n.onplay=function(){o.push({timestamp:(new Date).toISOString(),actionType:c,slideNumber:E(e),mediaSource:this.currentSrc,currentTime:Number.parseInt(this.currentTime),totalDuration:Number.parseInt(this.duration),...i}),console.log("🚀 ~ trackMediaEvents ~ logMediaActionEvents:",o)}),n.onpause||(n.onpause=function(){o.push({timestamp:(new Date).toISOString(),actionType:g,slideNumber:E(e),mediaSource:this.currentSrc,currentTime:Number.parseInt(this.currentTime),totalDuration:Number.parseInt(this.duration),progress:this.currentTime/this.duration,finished:this.ended,...i})})}}Reveal.addEventListener("ready",e),Reveal.addEventListener("fragmentshown",e),Reveal.addEventListener("fragmenthidden",e),Reveal.addEventListener("slidechanged",e)}}function y(){f()&&Reveal.addEventListener("slidechanged",(e=>{e.previousSlide&&(i.push({presentationId:t.apiConfig.presentationId,presentationUrl:w,timestamp:(new Date).toISOString(),slideNumber:E(e.previousSlide),dwellTime:C.getTime()}),C.reset())})),R(),(v()||h())&&document.addEventListener("click",(e=>{if(!Array.from(Reveal.getCurrentSlide().querySelectorAll("a")).includes(e.target))return!0;const n=window.location.href.replace(new RegExp(window.location.hash)||"",""),i=e.target.href.replace(n,""),o=i.startsWith("#");if(o&&v()||!o&&h()){const n=o?a:l,s=o?i:e.target.href,d=Reveal.getCurrentSlide();r.push({presentationId:t.apiConfig.presentationId,presentationUrl:w,timestamp:(new Date).toISOString(),slideNumber:E(d),linkType:n,linkUrl:s,linkText:e.target.text.trim()})}})),k(),function(){if(t.revealDependencies.quiz){const n=Reveal.getConfig().quiz||{};function i(){const n=Reveal.getCurrentSlide(),i=n.querySelector("[data-quiz]").dataset.quiz;if(!i)return!0;const r=window[i];if(!r)return!0;z[i]instanceof e?z[i].reset():(z[i]=new e,z[i].start());const o={quizId:i,quizName:r.info.name,numberOfQuestions:r.questions.length,presentationId:t.apiConfig.presentationId,presentationUrl:w};s.push({timestamp:(new Date).toISOString(),slideNumber:E(n),actionType:p,...o})}function r(t){const n=Reveal.getCurrentSlide().querySelector("[data-quiz]").dataset.quiz;if(!n)return!0;const i=window[n];if(!i)return!0;let r;z[n]instanceof e&&(r=z[n].getTime(),z[n].clear());const o={quizId:n,quizName:i.info.name,numberOfQuestions:i.questions.length};s.push({timestamp:(new Date).toISOString(),actionType:m,slideNumber:E(Reveal.getCurrentSlide()),dwellTime:r,completed:!0,score:t.score,...o})}if(n.events=n.events||{},n.events.onStartQuiz){const o=n.events.onStartQuiz;n.events.onStartQuiz=()=>{i(),o()}}else n.events.onStartQuiz=()=>{i()};if(n.events.onCompleteQuiz){const a=n.events.onCompleteQuiz;n.events.onCompleteQuiz=e=>{r(e),a(e)}}else n.events.onCompleteQuiz=e=>{r(e)};prepareQuizzes(n)}}()}return{id:"pp-tracking",init:e=>{const t=e.getConfig();y(),f()?(I.start(),C.start()):I.start(),t.ppTracking.debug&&(console.log("Initialized pp-tracking plugin"),console.log("Plugin Config:",t.ppTracking))}}}}));
