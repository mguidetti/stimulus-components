import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static values = {
    maxWidth: Number,
    locked: { type: Boolean, default: false }
  }

  lock () {
    this.changeLockedValue(true)
  }

  unlock () {
    this.changeLockedValue(false)
  }

  toggle () {
    this.changeLockedValue(!this.lockedValue)
  }

  changeLockedValue (value) {
    if (!this.checkWidth()) return false
    this.lockedValue = value
  }

  lockedValueChanged () {
    if (this.lockedValue) {
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = null
    }
  }

  checkWidth () {
    if (!this.hasMaxWidthValue) return true

    const mediaQuery = window.matchMedia(`(max-width: ${this.maxWidthValue}px)`)

    return mediaQuery.matches
  }
}
