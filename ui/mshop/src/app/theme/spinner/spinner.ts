import { Component, Input, signal, ViewEncapsulation } from '@angular/core';
import { NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Router } from '@angular/router';
import { Spinkit } from './spinkits';

@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
  encapsulation: ViewEncapsulation.None
})
export class Spinner {
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
        console.log('event', event);

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
