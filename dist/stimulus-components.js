var e=require("@hotwired/stimulus"),t=require("@rails/activestorage"),r=require("stimulus-use"),n=require("sortablejs"),i=require("uuid"),a=require("autosize");function o(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var s=/*#__PURE__*/o(n),l=/*#__PURE__*/o(a);function u(){return u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},u.apply(this,arguments)}function c(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,d(e,t)}function d(e,t){return d=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},d(e,t)}function h(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var f=0;function p(e){return"__private_"+f+++"_"+e}function m(e,t){if(!Object.prototype.hasOwnProperty.call(e,t))throw new TypeError("attempted to use private field on non-instance");return e}var g=/*#__PURE__*/function(){function e(e,r){var n=this;this.handleChange=function(e){n.options.onChangeFile(e)},this.handleProgress=function(e){n.handleChange({state:"uploading",file:n.directUpload.file,id:n.options.id,progress:e.loaded/e.total*100})},this.handleSuccess=function(e){return n.handleChange({state:"finished",id:n.options.id,file:n.directUpload.file,signedId:e}),e},this.handleError=function(e){throw n.handleChange({state:"error",id:n.options.id,file:n.directUpload.file,error:e}),e},this.directUpload=new t.DirectUpload(e,"/rails/active_storage/direct_uploads",this),this.options=r}var r=e.prototype;return r.start=function(){var e=this;return new Promise(function(t,r){e.directUpload.create(function(e,n){e?r(e):t(n.signed_id)})}).then(this.handleSuccess).catch(this.handleError)},r.directUploadWillCreateBlobWithXHR=function(e){this.options.onBeforeBlobRequest&&this.options.onBeforeBlobRequest({id:this.options.id,file:this.directUpload.file,xhr:e})},r.directUploadWillStoreFileWithXHR=function(e){this.options.onBeforeStorageRequest&&this.options.onBeforeStorageRequest({id:this.options.id,file:this.directUpload.file,xhr:e}),e.upload.addEventListener("progress",this.handleProgress)},e}(),v=/*#__PURE__*/function(e){function t(){for(var t,r=arguments.length,n=new Array(r),i=0;i<r;i++)n[i]=arguments[i];return(t=e.call.apply(e,[this].concat(n))||this).handleFileProgress=function(e){var r=document.querySelector('[data-temp-id="'+e.id+'"]');switch(e.state){case"uploading":r.querySelector(".progress-bar").style.width=e.progress+"%";break;case"error":r.remove(),t.setMessage("alert","Error uploading "+e.file.name+".");break;case"finished":r.querySelector(".upload-progress").remove();var n=document.createElement("input");n.setAttribute("type","hidden"),n.setAttribute("value",e.signedId),n.name=r.querySelector("input[name*='_destroy']").name.replace(/_destroy/g,"file"),r.appendChild(n),t.updateCount()}},t}c(t,e);var r,n,i=t.prototype;return i.handleFileClick=function(){if(this.hasMaxFilesValue&&this.activeFiles.length>=this.maxFilesValue)return this.setMessage("alert","Maximum files allowed: "+this.maxValue),!1;this.inputTarget.click()},i.handleNewFiles=function(e){try{var t=this,r=Array.from(e.target.files);return t.hasMaxFilesValue&&r.length+t.activeFiles.length>t.maxFilesValue?(t.setMessage("alert","Maximum files allowed: "+t.maxValue),Promise.resolve(!1)):Promise.resolve(Promise.all(r.map(function(e){return t.approveFile(e)}))).then(function(e){var r=e.filter(Boolean).map(function(e){return e});t.submitFiles(r),t.inputTarget.value=null})}catch(e){return Promise.reject(e)}},i.approveFile=function(e){try{var t,r=this;if(r.hasWhitelistValue&&!r.whitelistValue.includes(e.type))return r.setMessage("alert","Invalid file type: "+e.name),Promise.resolve(!1);if(r.hasmaxMbValue&&e.size>r.maxMb)return r.setMessage("alert","File size too large: "+e.name),Promise.resolve(!1);var n=function(){if(r.hasMaxDimensionValue)return Promise.resolve(r.getLargestDimension(e)).then(function(n){if(n>r.MaxDimensionValue)return r.setMessage("alert","Dimensions are too lage: "+e.name),t=1,!1})}();return Promise.resolve(n&&n.then?n.then(function(r){return t?r:e}):t?n:e)}catch(e){return Promise.reject(e)}},i.getLargestDimension=function(e){return new Promise(function(t){var r=new Image;r.src=URL.createObjectURL(e),r.onload=function(){var e=Math.max(r.width,r.height);URL.revokeObjectURL(r.src),t(e)}})},i.createAttachment=function(e){return this.element.nestedForm.addAssociation(e)},i.removeAttachment=function(e){this.element.nestedForm.removeAssociation(e),this.updateCount()},i.submitFiles=function(e){var t=this;e.forEach(function(e){var r=t.createAttachment();r.insertAdjacentHTML("beforeend",'\n        <div class="upload-progress">\n          <div class="progress-bar"></div>\n        </div>\n      '),r.querySelector(".filename").innerText=e.name,e.type.includes("image")&&r.querySelector("img")&&(r.querySelector("img").src=URL.createObjectURL(e)),new g(e,{id:r.dataset.tempId,onChangeFile:t.handleFileProgress}).start()})},i.updateCount=function(){this.hasCountTarget&&(this.countTarget.value=this.activeFiles.length)},i.setMessage=function(e,t){console.log(t)},r=t,(n=[{key:"activeFiles",get:function(){return this.fileTargets.filter(function(e){return!e.classList.contains("destroying")})}}])&&function(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}(r.prototype,n),Object.defineProperty(r,"prototype",{writable:!1}),t}(e.Controller);v.targets=["input","file","count","message"],v.values={maxFiles:Number,minFiles:Number,maxMb:Number,maxDimension:Number,whitelist:Array};var y=/*#__PURE__*/function(e){function t(){return e.apply(this,arguments)||this}c(t,e);var n=t.prototype;return n.connect=function(){r.useDebounce(this,{wait:this.debounceWaitValue})},n.submit=function(){this.formTarget.requestSubmit(),this.dispatch("submitted")},n.submitDebounced=function(){this.formTarget.requestSubmit(),this.dispatch("submitted")},n.clearInput=function(e){e.target.value=""},n.resetForm=function(){this.formTarget.reset()},n.clearForm=function(){var e=this.formTarget.elements,t=document.querySelectorAll('[form="'+this.formTarget.id+'"');[].concat(e,t).forEach(function(e){switch(e.type){case"checkbox":case"radio":e.checked=!1;break;default:e.value=""}})},n.addQueryString=function(e){var t=new URLSearchParams(new FormData(e.target));history.replaceState(null,null,"?"+t)},t}(e.Controller);y.debounces=["submitDebounced"],y.targets=["form"],y.values={debounceWait:{type:Number,default:150}};var b=/*#__PURE__*/p("findTemplate"),x=/*#__PURE__*/p("setContent"),w=/*#__PURE__*/p("approve"),F=/*#__PURE__*/p("activeItems"),V=/*#__PURE__*/function(e){function t(){for(var t,r=arguments.length,n=new Array(r),i=0;i<r;i++)n[i]=arguments[i];return t=e.call.apply(e,[this].concat(n))||this,Object.defineProperty(h(t),F,{get:P,set:void 0}),Object.defineProperty(h(t),w,{value:k}),Object.defineProperty(h(t),x,{value:T}),Object.defineProperty(h(t),b,{value:M}),t}c(t,e);var r=t.prototype;return r.add=function(e){if(!m(this,w)[w]())return!1;var t=m(this,x)[x](e);this.listTarget.insertAdjacentHTML("beforeend",t),this.dispatch("added",{detail:{element:this.listTarget.lastElementChild,previousEvent:e}})},r.replace=function(e){if(!m(this,w)[w]())return!1;var t=e.detail.element,r=m(this,x)[x](e);t.insertAdjacentHTML("afterend",r);var n=t.nextElementSibling;t.remove(),this.dispatch("replaced",{detail:{element:n,previousEvent:e}})},r.remove=function(e){if(this.confirmRemoveValue&&!1===confirm("Are you sure?"))return!1;var t=e.target.closest("[data-nested-form-target='item']");"true"===t.dataset.newRecord?t.remove():(t.querySelector("input[name*='_destroy']").value=1,t.classList.add("hidden","destroying")),this.dispatch("removed")},t}(e.Controller);function M(e){return this.templateTargets.find(function(t){return t.dataset.templateName===e})||this.defaultTemplateTarget||this.templateTarget}function T(e){var t,r,n=m(this,b)[b]((null==e||null==(t=e.target)?void 0:t.value)||(null==e||null==(r=e.detail)?void 0:r.template)),i=Date.now()*Math.floor(100*Math.random());return n.innerHTML.replace(new RegExp(this.replaceKeyValue,"g"),i)}function k(){return!(this.hasMaxValue&&m(this,F)[F].length>=this.maxValue&&(console.warn("alert","Maximum allowed: "+this.maxValue),1))}function P(){return this.itemTargets.filter(function(e){return!e.classList.contains("destroying")})}V.targets=["list","item","template","defaultTemplate","message"],V.values={replaceKey:{type:String,default:"NEW_RECORD"},max:Number,min:Number,confirmRemove:Boolean};var C=/*#__PURE__*/function(e){function t(){return e.apply(this,arguments)||this}c(t,e);var r=t.prototype;return r.lock=function(){this.changeLockedValue(!0)},r.unlock=function(){this.changeLockedValue(!1)},r.toggle=function(){this.changeLockedValue(!this.lockedValue)},r.changeLockedValue=function(e){if(!this.checkWidth())return!1;this.lockedValue=e},r.lockedValueChanged=function(){document.documentElement.style.overflow=this.lockedValue?"hidden":null},r.checkWidth=function(){return!this.hasMaxWidthValue||window.matchMedia("(max-width: "+this.maxWidthValue+"px)").matches},t}(e.Controller);C.values={maxWidth:Number,locked:{type:Boolean,default:!1}};var S=/*#__PURE__*/function(e){function t(){return e.apply(this,arguments)||this}c(t,e);var r=t.prototype;return r.initialize=function(){var e={group:i.v4(),animation:150,onEnd:this.end.bind(this),filter:"input, button, select, textarea",ghostClass:"opacity-25",preventOnFilter:!1,forceFallback:!0};this.sortable=s.default.create(this.element,u({},u({},e,this.optionsValue),{onEnd:this.end.bind(this)}))},r.update=function(){this.positionTargets.forEach(function(e,t){return e.value=t})},r.end=function(){this.update()},t}(e.Controller);S.targets=["position"],S.values={options:Object};var j=/*#__PURE__*/function(e){function t(){return e.apply(this,arguments)||this}return c(t,e),t.prototype.connect=function(){l.default(this.element)},t}(e.Controller);exports.ActivestorageAttachments=v,exports.AutoForm=y,exports.NestedForm=V,exports.ScrollLock=C,exports.Sortable=S,exports.TextareaAutosize=j;
//# sourceMappingURL=stimulus-components.js.map
