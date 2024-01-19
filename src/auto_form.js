/* global history */

import { Controller } from '@hotwired/stimulus'
import { useDebounce } from 'stimulus-use'

export default class extends Controller {
  static debounces = ['submitDebounced']
  static targets = ['form']

  static values = {
    debounceWait: { type: Number, default: 150 }
  }

  connect () {
    useDebounce(this, { wait: this.debounceWaitValue })
  }

  submit () {
    this.formTarget.requestSubmit()
    this.dispatch('submitted')
  }

  submitDebounced () {
    this.formTarget.requestSubmit()
    this.dispatch('submitted')
  }

  clearInput (event) {
    event.target.value = ''
  }

  resetForm () {
    this.formTarget.reset()
  }

  clearForm () {
    const elements = this.formTarget.elements
    const outsideElements = document.querySelectorAll(
      `[form="${this.formTarget.id}"`
    )
    const allElements = [...elements, ...outsideElements]

    allElements.forEach(element => {
      switch (element.type) {
        case 'checkbox':
        case 'radio':
          element.checked = false
          break
        default:
          element.value = ''
          break
      }
    })
  }

  addQueryString (event) {
    const params = new URLSearchParams(new FormData(event.target))

    history.replaceState(null, null, `?${params}`)
  }
}
