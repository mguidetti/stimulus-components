/* global confirm */

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['list', 'item', 'template', 'defaultTemplate', 'message']
  static values = {
    replaceKey: { type: String, default: 'NEW_RECORD' },
    max: Number,
    min: Number,
    confirmRemove: Boolean
  }

  add (event) {
    if (!this.#approve()) return false

    const content = this.#setContent(event)
    this.listTarget.insertAdjacentHTML('beforeend', content)

    const addedElement = this.listTarget.lastElementChild
    this.dispatch('added', { detail: { element: addedElement, previousEvent: event } })
  }

  replace (event) {
    // This method doesnt truly "replace" the target element. It inserts the new
    // template directly after it and then remove the original. It would be nicer
    // To truly replace the element, but mutating the replaceKey with innerHTML
    // was making that difficult.

    if (!this.#approve()) return false

    const targetElement = event.detail.element
    const content = this.#setContent(event)

    targetElement.insertAdjacentHTML('afterend', content)
    const newElement = targetElement.nextElementSibling
    targetElement.remove()

    this.dispatch('replaced', { detail: { element: newElement, previousEvent: event } })
  }

  remove (event) {
    if (this.confirmRemoveValue) {
      if (confirm('Are you sure?') === false) {
        return false
      }
    }

    const wrapper = event.target.closest("[data-nested-form-target='item']")

    // New records are simply removed from the page
    if (wrapper.dataset.newRecord === 'true') {
      wrapper.remove()

    // Existing records are hidden and flagged for deletion
    } else {
      wrapper.querySelector("input[name*='_destroy']").value = 1
      wrapper.classList.add('hidden', 'destroying')
    }

    this.dispatch('removed')
  }

  #findTemplate (name) {
    const found = this.templateTargets.find(element => element.dataset.templateName === name)

    return found || this.defaultTemplateTarget || this.templateTarget
  }

  #setContent (event) {
    const template = this.#findTemplate(event?.target?.value || event?.detail?.template)
    const tempId = Date.now() * Math.floor(Math.random() * 100)
    const content = template.innerHTML.replace(
      new RegExp(this.replaceKeyValue, 'g'), tempId
    )

    return content
  }

  #approve () {
    if (this.hasMaxValue && this.#activeItems.length >= this.maxValue) {
      console.warn('alert', `Maximum allowed: ${this.maxValue}`)
      return false
    } else {
      return true
    }
  }

  get #activeItems () {
    return this.itemTargets.filter(div => !div.classList.contains('destroying'))
  }
}
