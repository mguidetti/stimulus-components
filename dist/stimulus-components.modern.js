import{Controller as e}from"@hotwired/stimulus";import{DirectUpload as t}from"@rails/activestorage";import{useDebounce as s}from"stimulus-use";import i from"sortablejs";import{v4 as a}from"uuid";import r from"autosize";class o{constructor(e,s){this.handleChange=e=>{this.options.onChangeFile(e)},this.handleProgress=({loaded:e,total:t})=>{this.handleChange({state:"uploading",file:this.directUpload.file,id:this.options.id,progress:e/t*100})},this.handleSuccess=e=>(this.handleChange({state:"finished",id:this.options.id,file:this.directUpload.file,signedId:e}),e),this.handleError=e=>{throw this.handleChange({state:"error",id:this.options.id,file:this.directUpload.file,error:e}),e},this.directUpload=new t(e,"/rails/active_storage/direct_uploads",this),this.options=s}start(){return new Promise((e,t)=>{this.directUpload.create((s,i)=>{s?t(s):e(i.signed_id)})}).then(this.handleSuccess).catch(this.handleError)}directUploadWillCreateBlobWithXHR(e){this.options.onBeforeBlobRequest&&this.options.onBeforeBlobRequest({id:this.options.id,file:this.directUpload.file,xhr:e})}directUploadWillStoreFileWithXHR(e){this.options.onBeforeStorageRequest&&this.options.onBeforeStorageRequest({id:this.options.id,file:this.directUpload.file,xhr:e}),e.upload.addEventListener("progress",this.handleProgress)}}class l extends e{constructor(...e){super(...e),this.handleFileProgress=e=>{const t=document.querySelector(`[data-temp-id="${e.id}"]`);switch(e.state){case"uploading":t.querySelector(".progress-bar").style.width=`${e.progress}%`;break;case"error":t.remove(),this.setMessage("alert",`Error uploading ${e.file.name}.`);break;case"finished":{t.querySelector(".upload-progress").remove();const s=document.createElement("input");s.setAttribute("type","hidden"),s.setAttribute("value",e.signedId),s.name=t.querySelector("input[name*='_destroy']").name.replace(/_destroy/g,"file"),t.appendChild(s),this.updateCount();break}}}}get activeFiles(){return this.fileTargets.filter(e=>!e.classList.contains("destroying"))}handleFileClick(){if(this.hasMaxFilesValue&&this.activeFiles.length>=this.maxFilesValue)return this.setMessage("alert",`Maximum files allowed: ${this.maxValue}`),!1;this.inputTarget.click()}async handleNewFiles(e){const t=Array.from(e.target.files);if(this.hasMaxFilesValue&&t.length+this.activeFiles.length>this.maxFilesValue)return this.setMessage("alert",`Maximum files allowed: ${this.maxValue}`),!1;const s=(await Promise.all(t.map(e=>this.approveFile(e)))).filter(Boolean).map(e=>e);this.submitFiles(s),this.inputTarget.value=null}async approveFile(e){return this.hasWhitelistValue&&!this.whitelistValue.includes(e.type)?(this.setMessage("alert",`Invalid file type: ${e.name}`),!1):this.hasmaxMbValue&&e.size>this.maxMb?(this.setMessage("alert",`File size too large: ${e.name}`),!1):this.hasMaxDimensionValue&&await this.getLargestDimension(e)>this.MaxDimensionValue?(this.setMessage("alert",`Dimensions are too lage: ${e.name}`),!1):e}getLargestDimension(e){return new Promise(t=>{const s=new Image;s.src=URL.createObjectURL(e),s.onload=()=>{const e=Math.max(s.width,s.height);URL.revokeObjectURL(s.src),t(e)}})}createAttachment(e){return this.element.nestedForm.addAssociation(e)}removeAttachment(e){this.element.nestedForm.removeAssociation(e),this.updateCount()}submitFiles(e){e.forEach(e=>{const t=this.createAttachment();t.insertAdjacentHTML("beforeend",'\n        <div class="upload-progress">\n          <div class="progress-bar"></div>\n        </div>\n      '),t.querySelector(".filename").innerText=e.name,e.type.includes("image")&&t.querySelector("img")&&(t.querySelector("img").src=URL.createObjectURL(e)),new o(e,{id:t.dataset.tempId,onChangeFile:this.handleFileProgress}).start()})}updateCount(){this.hasCountTarget&&(this.countTarget.value=this.activeFiles.length)}setMessage(e,t){console.log(t)}}l.targets=["input","file","count","message"],l.values={maxFiles:Number,minFiles:Number,maxMb:Number,maxDimension:Number,whitelist:Array};class n extends e{connect(){s(this,{wait:this.debounceWaitValue})}submit(){this.formTarget.requestSubmit(),this.dispatch("submitted")}submitDebounced(){this.formTarget.requestSubmit(),this.dispatch("submitted")}clearInput(e){e.target.value=""}resetForm(){this.formTarget.reset()}clearForm(){[...this.formTarget.elements,...document.querySelectorAll(`[form="${this.formTarget.id}"`)].forEach(e=>{switch(e.type){case"checkbox":case"radio":e.checked=!1;break;default:e.value=""}})}addQueryString(e){const t=new URLSearchParams(new FormData(e.target));history.replaceState(null,null,`?${t}`)}}n.debounces=["submitDebounced"],n.targets=["form"],n.values={debounceWait:{type:Number,default:150}};class h extends e{expandAll(){this.detailTargets.forEach(e=>{e.setAttribute("open",!0)}),this.dispatch("expanded-all")}collapseAll(){this.detailTargets.forEach(e=>{e.removeAttribute("open")}),this.dispatch("collapsed-all")}collapseOthers(e){this.detailTargets.forEach(t=>{t!==e.target&&t.removeAttribute("open")}),this.dispatch("collapsed-others")}}function d(){return d=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var s=arguments[t];for(var i in s)Object.prototype.hasOwnProperty.call(s,i)&&(e[i]=s[i])}return e},d.apply(this,arguments)}h.targets=["detail"];var c=0;function u(e){return"__private_"+c+++"_"+e}function m(e,t){if(!Object.prototype.hasOwnProperty.call(e,t))throw new TypeError("attempted to use private field on non-instance");return e}var p=/*#__PURE__*/u("findTemplate"),g=/*#__PURE__*/u("setContent"),f=/*#__PURE__*/u("approve"),b=/*#__PURE__*/u("activeItems");class v extends e{constructor(...e){super(...e),Object.defineProperty(this,b,{get:F,set:void 0}),Object.defineProperty(this,f,{value:w}),Object.defineProperty(this,g,{value:x}),Object.defineProperty(this,p,{value:y})}add(e){if(!m(this,f)[f]())return!1;const t=m(this,g)[g](e);this.listTarget.insertAdjacentHTML("beforeend",t),this.dispatch("added",{detail:{element:this.listTarget.lastElementChild,previousEvent:e}})}replace(e){if(!m(this,f)[f]())return!1;const t=e.detail.element,s=m(this,g)[g](e);t.insertAdjacentHTML("afterend",s);const i=t.nextElementSibling;t.remove(),this.dispatch("replaced",{detail:{element:i,previousEvent:e}})}remove(e){if(this.confirmRemoveValue&&!1===confirm("Are you sure?"))return!1;const t=e.target.closest("[data-nested-form-target='item']");"true"===t.dataset.newRecord?t.remove():(t.querySelector("input[name*='_destroy']").value=1,t.classList.add("hidden","destroying")),this.dispatch("removed")}}function y(e){return this.templateTargets.find(t=>t.dataset.templateName===e)||this.defaultTemplateTarget||this.templateTarget}function x(e){var t,s;const i=m(this,p)[p]((null==e||null==(t=e.target)?void 0:t.value)||(null==e||null==(s=e.detail)?void 0:s.template)),a=Date.now()*Math.floor(100*Math.random());return i.innerHTML.replace(new RegExp(this.replaceKeyValue,"g"),a)}function w(){return!(this.hasMaxValue&&m(this,b)[b].length>=this.maxValue&&(console.warn("alert",`Maximum allowed: ${this.maxValue}`),1))}function F(){return this.itemTargets.filter(e=>!e.classList.contains("destroying"))}v.targets=["list","item","template","defaultTemplate","message"],v.values={replaceKey:{type:String,default:"NEW_RECORD"},max:Number,min:Number,confirmRemove:Boolean};class T extends e{lock(){this.changeLockedValue(!0)}unlock(){this.changeLockedValue(!1)}toggle(){this.changeLockedValue(!this.lockedValue)}changeLockedValue(e){if(!this.checkWidth())return!1;this.lockedValue=e}lockedValueChanged(){document.documentElement.style.overflow=this.lockedValue?"hidden":null}checkWidth(){return!this.hasMaxWidthValue||window.matchMedia(`(max-width: ${this.maxWidthValue}px)`).matches}}T.values={maxWidth:Number,locked:{type:Boolean,default:!1}};class V extends e{initialize(){const e={group:a(),animation:150,onEnd:this.end.bind(this),filter:"input, button, select, textarea",ghostClass:"opacity-25",preventOnFilter:!1,forceFallback:!0};this.sortable=i.create(this.element,d({},d({},e,this.optionsValue),{onEnd:this.end.bind(this)}))}update(){this.positionTargets.forEach((e,t)=>e.value=t)}end(){this.update()}}V.targets=["position"],V.values={options:Object};class M extends e{connect(){r(this.element)}}export{l as ActivestorageAttachments,n as AutoForm,h as Details,v as NestedForm,T as ScrollLock,V as Sortable,M as TextareaAutosize};
//# sourceMappingURL=stimulus-components.modern.js.map
