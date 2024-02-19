import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['detail']

  expandAll () {
    this.detailTargets.forEach(element => {
      element.setAttribute('open', true)
    })

    this.dispatch('expanded-all')
  }

  collapseAll () {
    this.detailTargets.forEach(element => {
      element.removeAttribute('open')
    })

    this.dispatch('collapsed-all')
  }

  collapseOthers (event) {
    this.detailTargets.forEach(element => {
      if (element !== event.target) {
        element.removeAttribute('open')
      }
    })

    this.dispatch('collapsed-others')
  }
}
