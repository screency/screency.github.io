parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"Tnu0":[function(require,module,exports) {

},{}],"vRaH":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.VideoMerge=void 0;class t{constructor(){this.canvas=document.getElementById("merge-canvas"),this.context=this.canvas.getContext("2d"),this.webcamVideo=document.getElementById("vm-webcam"),this.displayVideo=document.getElementById("vm-display"),this.watermark=document.getElementById("vm-watermark"),this.webcamRatio=.2,this.webcamMargin=10,this.isStopped=!0,this.watermarkEnabled=!0,this.watermarkRatio=.2,this.watermarkMarginRight=50,this.watermarkMarginBottom=30,this.setFPS(60),this.setCanvasSize(800,600),this.displayVideo.addEventListener("loadedmetadata",()=>{this.displayVideo.play()}),this.webcamVideo.addEventListener("loadedmetadata",()=>{this.webcamVideo.play()})}start(){return this.isStopped=!1,this.draw(),this.stream=this.canvas.captureStream(this.fps),this.stream}stop(){this.isStopped=!0,this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight),this.stopVideo(this.displayVideo),this.stopVideo(this.webcamVideo),this.stream&&this.stream.getVideoTracks().forEach(t=>{t.stop()})}isStarted(){return!this.isStopped}enableWatermark(){this.watermarkEnabled=!0}disableWatermark(){this.watermarkEnabled=!1}addWebcam(t){this.webcamVideo.srcObject=t;const e=this.getStreamSettings(t);e&&(this.webcamHeight=this.webcamWidth/e.ratio,this.webcamRadius=this.webcamHeight/2,this.webcamXOffset=-(this.webcamWidth-this.webcamHeight)/2,this.webcamY=this.canvasHeight-this.webcamHeight-this.webcamMargin)}addDisplay(t){this.displayVideo.srcObject=t;const e=this.getStreamSettings(t);e&&(this.setCanvasSize(e.width,e.height),this.fps=e.fps)}draw(){this.isStopped||(this.context.drawImage(this.displayVideo,0,0,this.canvasWidth,this.canvasHeight),this.drawInCircle(),this.watermarkEnabled&&this.drawWatermark(),setTimeout(this.draw.bind(this),1e3/this.fps))}drawInCircle(){this.webcamRadius&&(this.context.save(),this.context.beginPath(),this.context.arc(this.webcamRadius+this.webcamMargin,this.webcamY+this.webcamRadius,this.webcamRadius,0,2*Math.PI,!0),this.context.closePath(),this.context.clip(),this.context.drawImage(this.webcamVideo,this.webcamXOffset+this.webcamMargin,this.webcamY,this.webcamWidth,this.webcamHeight),this.context.restore())}drawWatermark(){this.context.drawImage(this.watermark,this.watermarkXOffset,this.watermarkYOffset,this.watermarkWidth,this.watermarkHeight)}getStreamSettings(t){const e=t.getVideoTracks();if(0===e.length)return console.error("can't get stream settings"),null;const i=e[0].getSettings();return{ratio:i.aspectRatio,fps:i.frameRate,width:i.width,height:i.height}}setCanvasSize(t,e){this.canvasHeight=e,this.canvasWidth=t,this.canvas.height=this.canvasHeight,this.canvas.width=this.canvasWidth,this.webcamWidth=this.canvasWidth*this.webcamRatio,this.calcWatermarkSize()}setFPS(t){this.fps=t<25||t>60?60:t}stopVideo(t){t.pause(),t.currentTime=0,t.srcObject=null}calcWatermarkSize(){this.watermarkWidth=this.canvasWidth*this.watermarkRatio,this.watermarkHeight=this.watermarkWidth/this.watermark.width*this.watermark.height,this.watermarkXOffset=this.canvasWidth-this.watermarkWidth-this.watermarkMarginRight,this.watermarkYOffset=this.canvasHeight-this.watermarkHeight-this.watermarkMarginBottom}}exports.VideoMerge=t;
},{}],"q5gj":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Recorder=void 0;var e=require("./video-merge");const t={NotSupports:"Sorry, your browser does not support screen capture",NotAllowedScreen:"Please enable screen capture",NotAllowedMic:"You did not allow access to the microphone",NotAllowedWebcam:"You did not allow access to the webcam",WebcamNotFound:"Webcam not found",RecordingError:"There was an error while recording, recording was stopped",Unknown:"Unknown error"};class r extends EventTarget{constructor(){super(),this.alertEl=document.getElementById("alert-message"),this.merger=new e.VideoMerge}async start({enableDesktopAudio:e=!1,enableMicAudio:t=!1,enableWebcam:r=!1,picInPic:s=!1,enableWatermark:i=!0}){if(!this.checkSupportAndAlert())return;if(this.active)return;if(this.hideAlert(),this.recording&&window.URL.revokeObjectURL(this.recording),this.chunks=[],this.recording=null,this.desktopStream=await this.getDesktopStream(e),null===this.desktopStream)return;this.desktopStream.addEventListener("inactive",e=>{this.stopRecording()}),t&&(this.voiceStream=await this.getVoiceStream());let o=this.desktopStream;if(r){if(this.webcamStream=await this.getWebcamStream(),!this.webcamStream)return void this.stopRecording();s||(this.merger.addDisplay(this.desktopStream),this.merger.addWebcam(this.webcamStream),o=this.merger.start())}i?(this.merger.enableWatermark(),this.merger.isStarted()||(this.merger.addDisplay(this.desktopStream),o=this.merger.start())):this.merger.disableWatermark();const a=[...o.getVideoTracks(),...this.mergeAudioStreams(this.desktopStream,this.voiceStream)];this.active=!0,this.stream=new MediaStream(a),this.recorder=this.initMediaRecorder(this.stream),this.recorder.start(10),this.dispatchEvent(new CustomEvent("start",{detail:s?this.webcamStream:null})),this.merger.start()}stop(){this.hideAlert(),this.stopRecording()}stopRecording(){this.active=!1,this.recorder&&"inactive"!==this.recorder.state&&this.recorder.stop(),this.recorder=null,this.stopStream(this.stream),this.stopStream(this.voiceStream),this.stopStream(this.desktopStream),this.stopStream(this.webcamStream),this.merger.stop(),this.stream=null,this.voiceStream=null,this.desktopStream=null,this.webcamStream=null,this.chunks.length&&(this.recording=window.URL.createObjectURL(new Blob(this.chunks,{type:"video/webm; codecs=vp8"}))),this.dispatchEvent(new CustomEvent("stop",{detail:this.recording}))}stopStream(e){e&&e.getTracks().forEach(e=>{e.stop()})}async getDesktopStream(e){try{return await navigator.mediaDevices.getDisplayMedia({video:!0,audio:e})}catch(r){return this.isNotAllowedError(r)?this.showAlert(t.NotAllowedScreen,!0):(this.showAlert(t.Unknown,!0),console.error("user display stream request failed: ",r)),null}}async getVoiceStream(){try{return await navigator.mediaDevices.getUserMedia({video:!1,audio:!0})}catch(e){return this.isNotAllowedError(e)?this.showAlert(t.NotAllowedMic,!1):(this.showAlert(t.Unknown,!0),console.error("user voice stream request failed: ",e)),null}}async getWebcamStream(){try{return await navigator.mediaDevices.getUserMedia({video:!0,audio:!1})}catch(e){return this.isNotAllowedError(e)?this.showAlert(t.NotAllowedWebcam,!1):"NotFoundError"===e.name?this.showAlert(t.WebcamNotFound,!1):(this.showAlert(t.Unknown,!0),console.error("user webcam stream request failed: ",e)),null}}initMediaRecorder(e){const r=new MediaRecorder(e,{mimeType:"video/webm"});return r.addEventListener("dataavailable",e=>{e.data&&e.data.size>0&&this.chunks.push(e.data)}),r.addEventListener("onstop",()=>{this.stopRecording()}),r.addEventListener("onerror",()=>{this.showAlert(t.RecordingError,!1),this.stopRecording()}),r}mergeAudioStreams(e,t){const r=new AudioContext,s=r.createMediaStreamDestination();let i=!1,o=!1;if(e&&e.getAudioTracks().length>0){r.createMediaStreamSource(e).connect(s),i=!0}if(t&&t.getAudioTracks().length>0){r.createMediaStreamSource(t).connect(s),o=!0}return i||o?s.stream.getAudioTracks():[]}isNotAllowedError(e){return"NotAllowedError"===e.name}checkSupportAndAlert(){return!!this.isSupports()||(this.showAlert(t.NotSupports,!1),this.notSupports=!0,!1)}isSupports(){return void 0!==navigator.mediaDevices&&(void 0!==navigator.mediaDevices.getDisplayMedia&&void 0!==navigator.mediaDevices.getUserMedia)}showAlert(e,t){this.alertEl.style.display="block",this.alertEl.innerText=e,t&&setTimeout(()=>{this.hideAlert()},3e3)}hideAlert(){this.alertEl.style.display="none"}}exports.Recorder=r;
},{"./video-merge":"vRaH"}],"Focm":[function(require,module,exports) {
"use strict";require("./styles.css");var e=require("./recorder");function t(e,t){e.disabled=!t}document.addEventListener("DOMContentLoaded",function(c){const d=new e.Recorder,n=document.getElementById("btn-start"),i=document.getElementById("btn-stop"),r=document.getElementById("btn-download"),a=document.getElementById("mic-switch"),s=document.getElementById("desktop-audio-switch"),o=document.getElementById("webcam-switch"),l=document.getElementById("pinp-switch"),u=document.getElementById("watermark-switch"),m=document.getElementById("video-out"),p=document.getElementById("webcam");let E=!1,y=!1,b=!1,h=!1;n.addEventListener("click",()=>{y=!!l.checked,d.start({enableDesktopAudio:s.checked,enableMicAudio:a.checked,enableWebcam:o.checked,picInPic:l.checked,enableWatermark:u.checked})}),i.addEventListener("click",()=>{d.stop()}),r.addEventListener("click",e=>{!b&&h||e.preventDefault()}),d.addEventListener("start",e=>{t(n,!1),t(i,!0),b=!0,y&&(e.detail&&(p.muted=!0,p.srcObject=e.detail),p.addEventListener("loadedmetadata",()=>{p.style.opacity=1}))}),d.addEventListener("stop",e=>{e.detail?(m.src=e.detail,r.href=e.detail,h=!0,b=!1):(h=!1,b=!1),t(n,!0),t(i,!1),r.classList.remove("btn-disabled"),p.style.opacity=0,E&&document.exitPictureInPicture().then(()=>{E=!1}).catch(e=>{console.error("exit picture in picture failed:",e)})}),p.addEventListener("enterpictureinpicture",()=>{p.style.opacity=0,E=!0}),p.addEventListener("leavepictureinpicture",()=>{E=!1,b&&(p.style.opacity=1)}),p.addEventListener("dblclick",()=>{p.requestPictureInPicture().catch(e=>{console.error("picture in picture request failed:",e),E=!0})})});
},{"./styles.css":"Tnu0","./recorder":"q5gj"}]},{},["Focm"], null)