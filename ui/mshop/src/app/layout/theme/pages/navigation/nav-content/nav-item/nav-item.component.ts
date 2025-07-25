import { Component, Input } from '@angular/core';
import { NavigationItem } from '../../navigation';

@Component({
  selector: 'ithouse-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss',
  standalone: false
})
export class NavItemComponent {
// public props
@Input() item!: NavigationItem;

// public method
closeOtherMenu(event: MouseEvent) {
  const ele = event.target as HTMLElement;
  if (ele !== null && ele !== undefined) {
    const parent = ele.parentElement as HTMLElement;
    const up_parent = ((parent.parentElement as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
    const last_parent = up_parent.parentElement;
    const sections = document.querySelectorAll('.pcoded-hasmenu');
    for (let i = 0; i < sections.length; i++) {
      sections[i].classList.remove('active');
      sections[i].classList.remove('pcoded-trigger');
    }

    if (parent.classList.contains('pcoded-hasmenu')) {
      parent.classList.add('pcoded-trigger');
      parent.classList.add('active');
    } else if (up_parent.classList.contains('pcoded-hasmenu')) {
      up_parent.classList.add('pcoded-trigger');
      up_parent.classList.add('active');
    } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
      last_parent.classList.add('pcoded-trigger');
      last_parent.classList.add('active');
    }
  }
  if (document.querySelector('ithouse-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
    document.querySelector('ithouse-navigation.pcoded-navbar')?.classList.remove('mob-open');
  }
}
}
