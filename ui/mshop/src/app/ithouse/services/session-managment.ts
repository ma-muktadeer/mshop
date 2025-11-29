import { inject, Injectable, OnDestroy } from '@angular/core';
import { Service } from './service';
import { fromEvent, merge, Subject, Subscription } from 'rxjs';
import { CommonService } from './common.service';

@Injectable()
export class SessionManagment implements OnDestroy {
  private readonly cs = inject(CommonService);

  private activitySub?: Subscription;
  private appTimeOutMin: number;
  private userActivityTimer?: ReturnType<typeof setTimeout>;
  private userInactive = new Subject<void>();
  public startSession(time: number, service: Service) {
    if (this.activitySub || time < 1) {
      return;
    }
    this.appTimeOutMin = time;

    const activityEvent = merge(
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'keypress'),
      fromEvent(window, 'keydown'),
      fromEvent(window, 'scroll'),
      fromEvent(window, 'click'),
      fromEvent(window, 'touchmove'),
      fromEvent(window, 'touchstart'),
      fromEvent(window, 'focus'),
    );
    this.activitySub = activityEvent.subscribe(() => {
      this.resetSessionTime(service);
    });
  }

  private resetSessionTime(service: Service) {
    if (this.userActivityTimer) {
      clearTimeout(this.userActivityTimer);
    }
    this.userActivityTimer = setTimeout(() => {
      this.userInactive.next();
      console.log('User is inactive');
      this.cs.logout(service);
    }, this.appTimeOutMin * 60 * 1000);
  }

  private stopSession() {
    console.log('Destroying session');
    if (this.userActivityTimer) {
      clearTimeout(this.userActivityTimer);
      this.userActivityTimer = undefined;
    }
    if (this.activitySub) {
      this.activitySub.unsubscribe();
      this.activitySub = undefined;
    }
    this.userInactive.complete();
  }

  ngOnDestroy() {
    this.stopSession();
  }

}
