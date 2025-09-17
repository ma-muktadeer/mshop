import { Component, inject } from '@angular/core';
import { ToggleFullScreenDirective } from 'src/app/structure/shared/full-screen/toggle-full-screen';

@Component({
  selector: 'app-nav-left',
  imports: [],
  templateUrl: './nav-left.html',
  styleUrl: './nav-left.scss'
})
export class NavLeft {
  private tgl = inject(ToggleFullScreenDirective);
  click2FullScreen() {
    debugger
    this.tgl.onClick();
  }
}
