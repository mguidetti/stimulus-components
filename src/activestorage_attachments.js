import { Controller } from '@hotwired/stimulus'
import Uploader from '../lib/uploader'

export default class extends Controller {
  static targets = ['input', 'file', 'count', 'message']
  static values = {
    maxFiles: Number,
    minFiles: Number,
    maxMb: Number,
    maxDimension: Number,
    whitelist: Array
  }

  get activeFiles () {
    return this.fileTargets.filter(div => !div.classList.contains('destroying'))
  }

  handleFileClick () {
    if (
      this.hasMaxFilesValue &&
      this.activeFiles.length >= this.maxFilesValue
    ) {
      this.setMessage('alert', `Maximum files allowed: ${this.maxValue}`)
      return false
    }

    this.inputTarget.click()
  }

  async handleNewFiles (event) {
    const files = Array.from(event.target.files)

    if (
      this.hasMaxFilesValue &&
      files.length + this.activeFiles.length > this.maxFilesValue
    ) {
      this.setMessage('alert', `Maximum files allowed: ${this.maxValue}`)
      return false
    }

    const approvedFiles = await Promise.all(
      files.map(file => this.approveFile(file))
    )
    const results = approvedFiles.filter(Boolean).map(f => f)

    this.submitFiles(results)
    this.inputTarget.value = null
  }

  async approveFile (file) {
    if (this.hasWhitelistValue && !this.whitelistValue.includes(file.type)) {
      this.setMessage('alert', `Invalid file type: ${file.name}`)
      return false
    }

    if (this.hasmaxMbValue && file.size > this.maxMb) {
      this.setMessage('alert', `File size too large: ${file.name}`)
      return false
    }

    if (this.hasMaxDimensionValue) {
      const largestDimension = await this.getLargestDimension(file)

      if (largestDimension > this.MaxDimensionValue) {
        this.setMessage('alert', `Dimensions are too lage: ${file.name}`)
        return false
      }
    }

    return file
  }

  getLargestDimension (file) {
    return new Promise(resolve => {
      const img = new Image()
      img.src = URL.createObjectURL(file)

      img.onload = () => {
        const largestDimension = Math.max(img.width, img.height)
        URL.revokeObjectURL(img.src)
        resolve(largestDimension)
      }
    })
  }

  createAttachment (event) {
    return this.element.nestedForm.addAssociation(event)
  }

  removeAttachment (event) {
    this.element.nestedForm.removeAssociation(event)
    this.updateCount()
  }

  submitFiles (files) {
    files.forEach(file => {
      const attachment = this.createAttachment()

      const progressHtml = `
        <div class="upload-progress">
          <div class="progress-bar"></div>
        </div>
      `
      attachment.insertAdjacentHTML('beforeend', progressHtml)
      attachment.querySelector('.filename').innerText = file.name

      if (file.type.includes('image') && attachment.querySelector('img')) {
        attachment.querySelector('img').src = URL.createObjectURL(file)
      }

      const uploader = new Uploader(file, {
        id: attachment.dataset.tempId,
        onChangeFile: this.handleFileProgress
      })

      uploader.start()
    })
  }

  handleFileProgress = event => {
    const attachment = document.querySelector(`[data-temp-id="${event.id}"]`)

    switch (event.state) {
      case 'uploading':
        attachment.querySelector(
          '.progress-bar'
        ).style.width = `${event.progress}%`
        break
      case 'error':
        attachment.remove()
        this.setMessage('alert', `Error uploading ${event.file.name}.`)
        break
      case 'finished': {
        attachment.querySelector('.upload-progress').remove()

        const hiddenSignedIdField = document.createElement('input')

        hiddenSignedIdField.setAttribute('type', 'hidden')
        hiddenSignedIdField.setAttribute('value', event.signedId)
        hiddenSignedIdField.name = attachment
          .querySelector("input[name*='_destroy']")
          .name.replace(/_destroy/g, 'file')

        attachment.appendChild(hiddenSignedIdField)

        this.updateCount()
        break
      }
      default:
        break
    }
  }

  updateCount () {
    if (this.hasCountTarget) {
      this.countTarget.value = this.activeFiles.length
    }
  }

  setMessage (type, message) {
    console.log(message)
  }
}
