import { Component, inject } from '@angular/core';
import { ToggleFullScreenDirective } from 'src/app/structure/shared/full-screen/toggle-full-screen';

@Component({
  selector: 'app-nav-left',
  standalone: false,
  templateUrl: './nav-left.html',
  styleUrl: './nav-left.scss'
})
export class NavLeft {
  private tgl = inject(ToggleFullScreenDirective);
  click2FullScreen() {
    this.tgl.onClick();
  }
}
