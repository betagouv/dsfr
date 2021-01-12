import { Disclosure } from '../disclosure/disclosure';
import { DisclosuresGroup } from '../disclosure/disclosures-group';
import { CollapseButton } from './collapse-button';
import { CollapsesGroup } from './collapses-group';
import { COLLAPSE_SELECTOR } from './collapse-constants';

/**
 * Tab coorespond au panel d'un élement Tabs (tab panel)
 * Tab étend disclosure qui ajoute/enleve le modifier --selected,
 * et ajoute/eleve l'attribut hidden, sur le panel
 */
class Collapse extends Disclosure {
  constructor (element) {
    super(element);

    this.groupByAscendant();

    element.addEventListener('transitionend', this.transitionend.bind(this));
  }

  groupByAscendant () {
    for (const ascendant in CollapsesGroup.ascendants) {
      let element = this.element.parentElement;

      while (element) {
        if (element.classList.contains(ascendant)) {
          if (typeof CollapsesGroup.ascendants[ascendant] === 'string') {
            DisclosuresGroup.groupByParent(this, CollapsesGroup, CollapsesGroup.ascendants[ascendant]);
          } else {
            DisclosuresGroup.groupByParent(this, CollapsesGroup.ascendants[ascendant]);
          }
          return;
        }

        element = element.parentElement;
      }
    }
  }

  get GroupConstructor () { return CollapsesGroup; }

  buttonFactory (element) {
    return new CollapseButton(element, this);
  }

  static get type () { return Disclosure.TYPES.expand; }
  static get selector () { return COLLAPSE_SELECTOR; }

  transitionend (e) {
    if (!this.disclosed) this.element.style.display = 'none';
  }

  apply (value) {
    if (value) {
      this.element.style.display = '';
      this.element.style.setProperty('--collapser', 'none');
      const height = this.element.offsetHeight;
      this.element.style.setProperty('--collapse', -height + 'px');
      this.element.style.setProperty('--collapser', '');

      window.requestAnimationFrame(() => super.apply(true));
    } else {
      const height = this.element.offsetHeight;
      this.element.style.setProperty('--collapse', -height + 'px');
      super.apply(false);
    }
  }

  reset () {
    this.apply(false);
  }

  get hasFocus () {
    if (this.element === document.activeElement) return true;
    if (this.element.querySelectorAll(':focus').length > 0) return true;
    if (this.buttons.some((button) => { return button.hasFocus; })) return true;
    return false;
  }

  focus () {
    for (let i = 0; i < this.buttons.length; i++) {
      const button = this.buttons[i];
      if (button.hasAttribute) {
        button.element.focus();
        return;
      }
    }
  }
}

export { Collapse };