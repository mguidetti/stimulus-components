import { Controller } from '@hotwired/stimulus'
import Sortable from 'sortablejs'
import { v4 as uuidv4 } from 'uuid'

export default class extends Controller {
  static targets = ['position']
  static values = {
    options: Object
  }

  initialize () {
    const defaultOptions = {
      group: uuidv4(),
      animation: 150,
      onEnd: this.end.bind(this),
      filter: 'input, button, select, textarea',
      ghostClass: 'opacity-25',
      preventOnFilter: false,
      forceFallback: true
    }

    this.sortable = Sortable.create(this.element, {
      ...{ ...defaultOptions, ...this.optionsValue },
      onEnd: this.end.bind(this)
    })
  }

  update () {
    this.positionTargets.forEach((position, index) => (position.value = index))
  }

  end () {
    this.update()
  }
}
