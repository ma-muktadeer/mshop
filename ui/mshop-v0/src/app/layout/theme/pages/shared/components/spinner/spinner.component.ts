import { Component, Input } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Spinkit } from './spinkits';

@Component({
  selector: 'ithouse-spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
// public props
isSpinnerVisible = true;
Spinkit = Spinkit;
@Input() backgroundColor = '#2689E2';
@Input() spinner = Spinkit.skLine;

// constructor
constructor(
  private router: Router,
  // @Inject(DOCUMENT) private document: Document
) {
  this.router.events.subscribe(
    (event) => {
      if (event instanceof NavigationStart) {
        this.isSpinnerVisible = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isSpinnerVisible = false;
      }
    },
    () => {
      this.isSpinnerVisible = false;
    }
  );
}

// life cycle event
ngOnDestroy(): void {
  this.isSpinnerVisible = false;
}
}
