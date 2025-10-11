import { Component, DestroyRef, inject, Input, signal, ViewEncapsulation } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Spinkit } from './spinkits';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ithouse-spinner',
  imports: [],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
  encapsulation: ViewEncapsulation.None

})
export class Spinner {
  private readonly resposeRef = inject(DestroyRef);
// public props
  isSpinnerVisible = signal<boolean>(true);
  Spinkit = Spinkit;
  @Input() backgroundColor = '#2689E2';
  @Input() spinner = Spinkit.skLine;

  // constructor
  constructor(
    private router: Router,
  ) {
    this.router.events
      .pipe(takeUntilDestroyed(this.resposeRef))
      .subscribe({
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
