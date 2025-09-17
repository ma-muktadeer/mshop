import { trigger, transition, style, animate } from '@angular/animations';
import { Component, Input, signal } from '@angular/core';
import { NavigationItem } from '../../navigation-items';

@Component({
  selector: 'app-nav-collapse',
  standalone: false,
  templateUrl: './nav-collapse.html',
  styleUrl: './nav-collapse.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', display: 'block' }),
        animate('250ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [animate('250ms ease-in', style({ transform: 'translateY(-100%)' }))])
    ])
  ],
})
export class NavCollapse {
  @Input() item!: NavigationItem;

  setClass = signal<string>('fw-normal');
  // public method
  async navCollapse(e: MouseEvent) {

    this.setClass.update((value) => value === 'fw-bold' ? 'fw-normal' : 'fw-bold');
    let parent = e.target as HTMLElement;
    parent = (parent as HTMLElement).parentElement as HTMLElement;
    if (parent.tagName === 'A') {
      parent = parent.parentElement as HTMLElement;
    }
    // document.querySelectorAll('.fw-bold')
    await this.removeClase(parent, '.pcoded-hasmenu', 'pcoded-trigger');
    await this.removeClase(parent, '.fw-bold', 'fw-bold', 'fw-normal');
    // const curentElm = parent.getElementsByTagName('i');
    // debugger
    // for (let index = 0; index < curentElm.length; index++) {
    //   const element = curentElm[index];
    //   element.classList.add('fw-bold');
    // }
    let firstParent = parent.parentElement;
    let preParent = ((parent as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
    if (firstParent?.classList.contains('pcoded-hasmenu')) {
      do {
        firstParent?.classList.add('pcoded-trigger');
        firstParent = ((firstParent as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
      } while (firstParent.classList.contains('pcoded-hasmenu'));
    } else if (preParent.classList.contains('pcoded-submenu')) {
      do {
        preParent?.parentElement?.classList.add('pcoded-trigger');
        preParent = (((preParent as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
      } while (preParent.classList.contains('pcoded-submenu'));
    }
    parent.classList.toggle('pcoded-trigger');
  }
  async removeClase(parent: HTMLElement, selectQuary: string, removeClass: string, addClass: string = '') {
    const sections = document.querySelectorAll(selectQuary);
    for (let i = 0; i < sections.length; i++) {
      if (sections[i] !== parent) {
        sections[i].classList.remove(removeClass);
      }
      // if (addClass) {
      //   sections[i]?.classList?.add(addClass);
      // }
    }
  }
}