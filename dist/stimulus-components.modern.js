import{Controller as e}from"@hotwired/stimulus";import{DirectUpload as t}from"@rails/activestorage";import s from"sortablejs";import{v4 as i}from"uuid";class a{constructor(e,s){this.handleChange=e=>{this.options.onChangeFile(e)},this.handleProgress=({loaded:e,total:t})=>{this.handleChange({state:"uploading",file:this.directUpload.file,id:this.options.id,progress:e/t*100})},this.handleSuccess=e=>(this.handleChange({state:"finished",id:this.options.id,file:this.directUpload.file,signedId:e}),e),this.handleError=e=>{throw this.handleChange({state:"error",id:this.options.id,file:this.directUpload.file,error:e}),e},this.directUpload=new t(e,"/rails/active_storage/direct_uploads",this),this.options=s}start(){return new Promise((e,t)=>{this.directUpload.create((s,i)=>{s?t(s):e(i.signed_id)})}).then(this.handleSuccess).catch(this.handleError)}directUploadWillCreateBlobWithXHR(e){this.options.onBeforeBlobRequest&&this.options.onBeforeBlobRequest({id:this.options.id,file:this.directUpload.file,xhr:e})}directUploadWillStoreFileWithXHR(e){this.options.onBeforeStorageRequest&&this.options.onBeforeStorageRequest({id:this.options.id,file:this.directUpload.file,xhr:e}),e.upload.addEventListener("progress",this.handleProgress)}}class r extends e{constructor(...e){super(...e),this.handleFileProgress=e=>{const t=document.querySelector(`[data-temp-id="${e.id}"]`);switch(e.state){case"uploading":t.querySelector(".progress-bar").style.width=`${e.progress}%`;break;case"error":t.remove(),setMessage("alert",`Error uploading ${e.file.name}.`);break;case"finished":{t.querySelector(".upload-progress").remove();const s=document.createElement("input");s.setAttribute("type","hidden"),s.setAttribute("value",e.signedId),s.name=t.querySelector("input[name*='_destroy']").name.replace(/_destroy/g,"file"),t.appendChild(s),this.updateCount();break}}}}get activeFiles(){return this.fileTargets.filter(e=>!e.classList.contains("destroying"))}handleFileClick(){if(this.hasMaxFilesValue&&this.activeFiles.length>=this.maxFilesValue)return setMessage("alert",`Maximum files allowed: ${this.maxValue}`),!1;this.inputTarget.click()}async handleNewFiles(e){const t=Array.from(e.target.files);if(this.hasMaxFilesValue&&t.length+this.activeFiles.length>this.maxFilesValue)return setMessage("alert",`Maximum files allowed: ${this.maxValue}`),!1;const s=(await Promise.all(t.map(e=>this.approveFile(e)))).filter(Boolean).map(e=>e);this.submitFiles(s),this.inputTarget.value=null}async approveFile(e){return this.hasWhitelistValue&&!this.whitelistValue.includes(e.type)?(setMessage("alert",`Invalid file type: ${e.name}`),!1):this.hasmaxMbValue&&e.size>this.maxMb?(setMessage("alert",`File size too large: ${e.name}`),!1):this.hasMaxDimensionValue&&await this.getLargestDimension(e)>this.MaxDimensionValue?(setMessage("alert",`Dimensions are too lage: ${e.name}`),!1):e}getLargestDimension(e){return new Promise(t=>{const s=new Image;s.src=URL.createObjectURL(e),s.onload=()=>{const e=Math.max(s.width,s.height);URL.revokeObjectURL(s.src),t(e)}})}createAttachment(e){return this.element.nestedForm.addAssociation(e)}removeAttachment(e){this.element.nestedForm.removeAssociation(e),this.updateCount()}submitFiles(e){e.forEach(e=>{const t=this.createAttachment();t.insertAdjacentHTML("beforeend",'\n        <div class="upload-progress">\n          <div class="progress-bar"></div>\n        </div>\n      '),t.querySelector(".filename").innerText=e.name,e.type.includes("image")&&t.querySelector("img")&&(t.querySelector("img").src=URL.createObjectURL(e)),new a(e,{id:t.dataset.tempId,onChangeFile:this.handleFileProgress}).start()})}updateCount(){this.hasCountTarget&&(this.countTarget.value=this.activeFiles.length)}setMessage(e,t){console.log(t)}}r.targets=["input","file","count","message"],r.values={maxFiles:Number,minFiles:Number,maxMb:Number,maxDimension:Number,whitelist:Array};class l extends e{initialize(){this.element.nestedForm=this}get activeItems(){return this.itemTargets.filter(e=>!e.classList.contains("destroying"))}findTemplate(e){return e?this.templateTargets.find(t=>t.dataset.templateName==e):this.templateTarget}addAssociation(e){if(this.hasMaxValue&&this.activeItems.length>=this.maxValue)return setMessage("alert",`Maximum allowed: ${this.maxValue}`),!1;const t=void 0===e?this.templateTarget:this.findTemplate(e.target.value),s=Date.now()*Math.floor(100*Math.random()),i=t.innerHTML.replace(new RegExp(this.replaceKeyValue,"g"),s);this.listTarget.insertAdjacentHTML("beforeend",i);const a=this.listTarget.lastElementChild;return a.dataset.tempId=s,this.listTarget.sortableController&&this.listTarget.sortableController.update(),a}removeAssociation(e){if(this.confirmRemoveValue&&!1===confirm("Are you sure?"))return!1;const t=e.target.closest("[data-nested-form-target='item']");"true"==t.dataset.newRecord?t.remove():(t.querySelector("input[name*='_destroy']").value=1,t.classList.add("hidden","destroying"))}setMessage(e,t){console.log(t)}}l.targets=["list","item","template","message"],l.values={replaceKey:{type:String,default:"NEW_RECORD"},max:Number,min:Number,confirmRemove:Boolean};class o extends e{initialize(){this.element.sortableController=this,this.sortable=s.create(this.element,{group:i(),animation:150,onEnd:this.end.bind(this),filter:"input, button, select, textarea",preventOnFilter:!1})}update(){this.positionTargets.forEach((e,t)=>e.value=t)}end(){this.update()}}o.targets=["position"];export{r as ActivestorageAttachments,l as NestedForm,o as Sortable};
//# sourceMappingURL=stimulus-components.modern.js.map
