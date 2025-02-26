const e="INTERNAL",t="EXTERNAL",n="AUDIO",i="VIDEO",o="PLAY",r="PAUSE",s="START",a="COMPLETE",l={apiConfig:{},dwellTimes:!0,links:!0,media:!0,slideTransitions:!0,revealDependencies:{quiz:!1},debug:!1};
/*!
 * revealjs-pp-tracking plugin v1.0.0
 * Manh Tin Nguyen
 * MIT licensed
 *
 * Copyright (C) 2025 Manh Tin Nguyen
 */
class d{constructor(){this.seconds=0}start(){this.timer?console.log("The timer is already running."):this.timer=setInterval((()=>{this.seconds++}),1e3)}reset(){this.clear(),this.start()}clear(){this.timer&&(clearInterval(this.timer),this.timer=void 0),this.seconds=0}getTime(){return this.seconds}toString(){const e=Math.floor(this.seconds/3600),t=Math.floor(this.seconds%3600/60),n=this.seconds%60;return`${e>9?e:`0${e}`}:${t>9?t:`0${t}`}:${n>9?n:`0${n}`}`}}const c=e=>Reveal.getSlides().indexOf(e)+1,u=e=>!0===e.dwellTimes||e.dwellTimes.total,g=e=>!0===e.dwellTimes||e.dwellTimes.perSlide,p=e=>!0===e.links||e.links.internal,m=e=>!0===e.links||e.links.external,v=e=>!0===e.media||e.media.audio,f=e=>!0===e.media||e.media.video,h=(e,t)=>{if(!v(e)&&!f(e))return;const s=()=>{const s=(e=>document.querySelectorAll(v(e)&&f(e)?"audio, video":v(e)?"audio":"video"))(e),a=Reveal.getCurrentSlide();for(const l of s){const s={mediaId:l.id,mediaType:"AUDIO"===l.tagName?n:i,presentationId:e.apiConfig.presentationId,presentationUrl:window.location.href.replace(/(#(.+)?)/,"")};l.onplay||(l.onplay=function(){t.push({timestamp:(new Date).toISOString(),actionType:o,slideNumber:c(a),mediaSource:this.currentSrc,currentTime:Number.parseInt(this.currentTime,10),totalDuration:Number.parseInt(this.duration,10),...s}),e.debug&&console.log("🚀 Media played:",t)}),l.onpause||(l.onpause=function(){t.push({timestamp:(new Date).toISOString(),actionType:r,slideNumber:c(a),mediaSource:this.currentSrc,currentTime:Number.parseInt(this.currentTime,10),totalDuration:Number.parseInt(this.duration,10),progress:this.currentTime/this.duration,finished:this.ended,...s})})}};Reveal.addEventListener("ready",s),Reveal.addEventListener("fragmentshown",s),Reveal.addEventListener("fragmenthidden",s),Reveal.addEventListener("slidechanged",s)},w=()=>{const n={...l,...Reveal.getConfig().ppTracking},i={logPresentationViewEvents:[],logSlideViewEvents:[],logLinkActionEvents:[],logMediaActionEvents:[],logQuizActionEvents:[]};if(!n.apiConfig.trackingAPI)return console.error("You have no trackingAPI configured where to send tracking data to!"),null;const o=new d,r=new d,v=()=>{((e,t,n)=>{g(e)&&Reveal.addEventListener("slidechanged",(i=>{i.previousSlide&&(t.push({presentationId:e.apiConfig.presentationId,presentationUrl:window.location.href.replace(/(#(.+)?)/,""),timestamp:(new Date).toISOString(),slideNumber:c(i.previousSlide),dwellTime:n.getTime()}),n.reset())}))})(n,i.logSlideViewEvents,r),((e,{logPresentationViewEvents:t,logSlideViewEvents:n,logLinkActionEvents:i,logMediaActionEvents:o,logQuizActionEvents:r},s)=>{window.addEventListener("beforeunload",(()=>{const a=window.location.href.replace(/(#(.+)?)/,"");t.push({presentationId:e.apiConfig.presentationId,presentationUrl:a,timestamp:(new Date).toISOString(),finalProgress:Reveal.getProgress(),totalDwellTime:u(e)?s.getTime():null});const l={logPresentationViewEvents:t,logSlideViewEvents:n,logLinkActionEvents:i,logMediaActionEvents:o,logQuizActionEvents:r};e.debug&&console.log("🚀 ~ sending events:",l),navigator.sendBeacon(e.apiConfig.trackingAPI,JSON.stringify(l))}))})(n,i,o),((n,i)=>{(p(n)||m(n))&&document.addEventListener("click",(o=>{const r=Reveal.getCurrentSlide();if(!Array.from(r.querySelectorAll("a")).includes(o.target))return;const s=window.location.href.replace(new RegExp(window.location.hash)||"",""),a=o.target.href.replace(s,""),l=a.startsWith("#");if(l&&p(n)||!l&&m(n)){const s=l?e:t,d=l?a:o.target.href;i.push({presentationId:n.apiConfig.presentationId,presentationUrl:window.location.href.replace(/(#(.+)?)/,""),timestamp:(new Date).toISOString(),slideNumber:c(r),linkType:s,linkUrl:d,linkText:o.target.text.trim()})}}))})(n,i.logLinkActionEvents),h(n,i.logMediaActionEvents),((e,t)=>{if(!e.revealDependencies.quiz)return;const n={},i=Reveal.getConfig().quiz||{};i.events=i.events||{};const o=()=>{const i=Reveal.getCurrentSlide(),o=i.querySelector("[data-quiz]");if(!o)return!0;const r=o.dataset.quiz,a=window[r];if(!a)return!0;n[r]instanceof d?n[r].reset():(n[r]=new d,n[r].start());const l={quizId:r,quizName:a.info.name,numberOfQuestions:a.questions.length,presentationId:e.apiConfig.presentationId,presentationUrl:window.location.href.replace(/(#(.+)?)/,"")};return t.push({timestamp:(new Date).toISOString(),slideNumber:c(i),actionType:s,...l}),!0},r=i=>{const o=Reveal.getCurrentSlide(),r=o.querySelector("[data-quiz]");if(!r)return!0;const s=r.dataset.quiz,l=window[s];if(!l)return!0;let u;n[s]instanceof d&&(u=n[s].getTime(),n[s].clear());const g={quizId:s,quizName:l.info.name,numberOfQuestions:l.questions.length,presentationId:e.apiConfig.presentationId,presentationUrl:window.location.href.replace(/(#(.+)?)/,"")};return t.push({timestamp:(new Date).toISOString(),actionType:a,slideNumber:c(o),dwellTime:u,completed:!0,score:i.score,...g}),!0};if(i.events.onStartQuiz){const e=i.events.onStartQuiz;i.events.onStartQuiz=()=>{o(),e()}}else i.events.onStartQuiz=o;if(i.events.onCompleteQuiz){const e=i.events.onCompleteQuiz;i.events.onCompleteQuiz=t=>{r(t),e(t)}}else i.events.onCompleteQuiz=r;"function"==typeof prepareQuizzes&&prepareQuizzes(i)})(n,i.logQuizActionEvents)};return{id:"pp-tracking",init:()=>{v(),o.start(),g(n)&&r.start(),n.debug&&(console.log("Initialized pp-tracking plugin"),console.log("Plugin Config:",n))}}};export{w as default};
