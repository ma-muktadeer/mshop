import { Component, DestroyRef, inject, Input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Router } from '@angular/router';
import { Spinkit } from 'src/app/structure/shared/components/spinner/spinkits';

@Component({
  selector: 'ithouse-spinner',
  imports: [],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss'
})
export class Spinner {
  private readonly destroyRef = inject(DestroyRef);
  isSpinnerVisible = signal<boolean>(true);
  Spinkit = Spinkit;
  @Input() backgroundColor = '#2689E2';
  @Input() spinner = Spinkit.skLine;

  // constructor
  constructor(
    private router: Router,
  ) {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (event) => {
          if (event instanceof NavigationStart) {
            this.isSpinnerVisible.update(() => true);
          } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
            this.isSpinnerVisible.update(() => false);
          }
        },
        error: () => {
          this.isSpinnerVisible.update(() => false);
        }
      });
  }

  // life cycle event
  ngOnDestroy(): void {
    this.isSpinnerVisible.update(() => false);
  }
}
