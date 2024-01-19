import { DirectUpload } from '@rails/activestorage'

class Uploader {
  constructor (file, options) {
    this.directUpload = new DirectUpload(
      file,
      '/rails/active_storage/direct_uploads',
      this
    )
    this.options = options
  }

  start () {
    const promise = new Promise((resolve, reject) => {
      this.directUpload.create((error, blob) => {
        if (error) {
          reject(error)
        } else {
          resolve(blob.signed_id)
        }
      })
    })

    return promise.then(this.handleSuccess).catch(this.handleError)
  }

  handleChange = upload => {
    this.options.onChangeFile(upload)
  }

  handleProgress = ({ loaded, total }) => {
    const progress = (loaded / total) * 100

    this.handleChange({
      state: 'uploading',
      file: this.directUpload.file,
      id: this.options.id,
      progress
    })
  }

  handleSuccess = signedId => {
    this.handleChange({
      state: 'finished',
      id: this.options.id,
      file: this.directUpload.file,
      signedId
    })
    return signedId
  }

  handleError = error => {
    this.handleChange({
      state: 'error',
      id: this.options.id,
      file: this.directUpload.file,
      error
    })
    throw error
  }

  directUploadWillCreateBlobWithXHR (xhr) {
    this.options.onBeforeBlobRequest &&
      this.options.onBeforeBlobRequest({
        id: this.options.id,
        file: this.directUpload.file,
        xhr
      })
  }

  directUploadWillStoreFileWithXHR (xhr) {
    this.options.onBeforeStorageRequest &&
      this.options.onBeforeStorageRequest({
        id: this.options.id,
        file: this.directUpload.file,
        xhr
      })

    xhr.upload.addEventListener('progress', this.handleProgress)
  }
}

export default Uploader
