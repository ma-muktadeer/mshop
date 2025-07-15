import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationItem } from '../../navigation';

@Component({
  selector: 'ithouse-nav-collapse',
  templateUrl: './nav-collapse.component.html',
  styleUrl: './nav-collapse.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', display: 'block' }),
        animate('250ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [animate('250ms ease-in', style({ transform: 'translateY(-100%)' }))])
    ])
  ],
  standalone: false
})
export class NavCollapseComponent implements OnInit {
// public props
@Input() item!: NavigationItem;

constructor(){
}

ngOnInit(): void {

    console.log('collapse item', this.item);
    
}

// public method
navCollapse(e: MouseEvent) {
  let parent = e.target as HTMLElement;
  parent = (parent as HTMLElement).parentElement as HTMLElement;

  const sections = document.querySelectorAll('.pcoded-hasmenu');
  for (let i = 0; i < sections.length; i++) {
    if (sections[i] !== parent) {
      sections[i].classList.remove('pcoded-trigger');
    }
  }
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
}
