// import { inject, Injectable } from '@angular/core';
// import { PermissionStoreService } from '../../../../ithouse/services/PermissionStoreService';
// import { NavigationItem } from '../../navigation-items';
// import { Observable } from 'rxjs';
// import { NavigationService } from '../navigation.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class NabItemsService {
//   private navigationService = inject(NavigationService);

//   constructor(private permissionService: PermissionStoreService) { }

//   buildNavItems = (items:NavigationItem[]): Observable<NavigationItem[]> => {
// debugger
//     const filtered = items
//     .map(item => {
//       if (item.permission === 'DEFAULT' || this.permissionService.hasAnyPermission(item.permission)) {
//         const newItem: NavigationItem = { ...item };

//         if (newItem.children) {
//           // recursion still needs to unwrap observable
//           newItem.children = this.buildNavItems(newItem.children) as any;
//         }

//         return newItem;
//       }
//       return undefined;
//     })
//       .filter((item): item is NavigationItem => !!item);

//     return this.navigationService.getNavigationItems(filtered);
//   }

//   findNabItems = (items, url): NavigationItem[] => {
//     for (const item of items) {

//       if (item.url === url) {
//         return [{ ...item }];
//       }
//       if (item.children) {
//         const childResult = this.findNabItems(item.children, url);
//         if (childResult && childResult.length) {
//           return childResult;
//         }
//       }
//     }
//     return [];
//   };

// }
