import { Controller } from '@hotwired/stimulus'
import Sortable from 'sortablejs'
import { v4 as uuidv4 } from 'uuid'

export default class extends Controller {
  static targets = ['position']
  static values = {
    options: Object
  }

  initialize() {
    const defaultOptions = {
      group: uuidv4(),
      animation: 150,
      filter: 'input, button, select, textarea',
      ghostClass: 'opacity-25',
      preventOnFilter: false,
      forceFallback: true
    }

    this.sortable = Sortable.create(this.element, {
      ...{ ...defaultOptions, ...this.optionsValue },
      onSort: this.onSort.bind(this),
    })
  }

  update() {
    this.dispatch("update")
    this.positionTargets.forEach((position, index) => (position.value = index))
  }

  onSort(e) {
    const event = this.dispatch("sort", { detail: { event: e }, cancelable: true })
    if (event.defaultPrevented) return

    this.update()
  }
}
