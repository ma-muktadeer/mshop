import {signal, Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

// project import
import { Spinkit } from './spinkits';

@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss', './spinkit-css/sk-line-material.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnDestroy {
  // public props
  isSpinnerVisible = signal<boolean>(true);
  Spinkit = Spinkit;
  @Input() backgroundColor = '#2689E2';
  @Input() spinner = Spinkit.skLine;

  // constructor
  constructor(
    private router: Router,
  ) {
    this.router.events.subscribe({
      next: (event: any) => {
        if (event instanceof NavigationStart) {
          this.isSpinnerVisible.update(() => true);
        } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
          this.isSpinnerVisible.update(() => false);
        }
      },
      error: (err: any) => {
        this.isSpinnerVisible.update(() => false);
      }
    });
  }

  // life cycle event
  ngOnDestroy(): void {
    this.isSpinnerVisible.update(() => false);
  }
}
