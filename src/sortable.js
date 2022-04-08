import { Controller } from '@hotwired/stimulus'
import Sortable from 'sortablejs'
import { v4 as uuidv4 } from 'uuid'

export default class extends Controller {
  static targets = ['position']

  initialize () {
    this.element.sortableController = this

    this.sortable = Sortable.create(this.element, {
      group: uuidv4(),
      animation: 150,
      onEnd: this.end.bind(this),
      filter: 'input, button, select, textarea',
      preventOnFilter: false
    })
  }

  update () {
    this.positionTargets.forEach((position, index) => (position.value = index))
  }

  end () {
    this.update()
  }
}
