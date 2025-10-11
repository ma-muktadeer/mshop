import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabManagerService {

  private sessionStorage: any;

  private uniqueId: string;
  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(platformId)) {
      this.uniqueId = this.generateUniqueId();
      console.log('active tab id', this.uniqueId);
      this.sessionStorage = document.defaultView?.localStorage;
      this.sessionStorage.setItem('activeTab', this.uniqueId);

    }
  }
  private generateUniqueId(): string {
    return `tab-${Math.random().toString(36).substring(2, 9)}`;
  }

  getTabId(): string {
    return this.uniqueId ?? this.sessionStorage.getItem('activeTab');
  }

  isActiveTab(activeTabId: string): boolean {
    return activeTabId === this.getTabId();
  }

}
