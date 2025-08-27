import { AppPermission } from "../../ithouse/services/PermissionStoreService";

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  isHidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  permission: AppPermission[] | 'DEFAULT';
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];

}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-group',
    permission: 'DEFAULT',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/:loginName/home',
        icon: 'feather icon-home',
        permission: 'DEFAULT'
      }
    ]
  },
  {
    id: 'admin',
    title: 'Admin',
    type: 'group',
    icon: 'icon-group',
    permission: 'DEFAULT',
    children: [
      {
        id: 'ad_user',
        title: 'Admin',
        type: 'collapse',
        // url: '/:loginName/home',
        icon: 'feather icon-box',
        permission: 'DEFAULT',
        children: [
          {
            id: 'user_list',
            title: 'User List',
            type: 'item',
            url: '/:loginName/admin/user',
            icon: 'feather icon-home',
            permission: 'DEFAULT'
          },
          {
            id: 'user_test',
            title: 'User test',
            type: 'item',
            isHidden: true,
            url: '/:loginName/admin/userr',
            icon: 'feather icon-home',
            permission: 'DEFAULT'
          }
        ]
      }
    ]
  },
  {
    id: 'mshop',
    title: 'M-SHOP',
    type: 'group',
    icon: 'icon-group',
    permission: 'DEFAULT',
    children: [
      {
        id: 'myShop',
        title: 'M-Shop',
        type: 'collapse',
        icon: 'feather icon-box',
        permission: 'DEFAULT',
        children: [
          {
            id: 'product',
            title: 'Products',
            type: 'item',
            url: '/:loginName/mshop/products',
            icon: 'feather icon-shopping-cart',
            permission: 'DEFAULT'
          }
        ]
      }
    ]
  }

  // *********** this is the default url which was not showing in the nav-bar***********
  // {
  //   id: 'extra-uri',
  //   title: 'Extra URL',
  //   type: 'group',
  //   isHidden: true,
  //   icon: 'icon-group',
  //   permission: 'DEFAULT',
  //   children: [
  //     {
  //       id: 'bank-view',
  //       isHidden: true,
  //       title: 'Bank View',
  //       type: 'item',
  //       url: '/admin/bank-view',
  //       permission: 'DEFAULT',
  //       icon: 'feather icon-home'
  //     },
  //     {
  //       id: 'mng-role',
  //       isHidden: true,
  //       title: 'Manage Role',
  //       type: 'item',
  //       url: '/admin/manage-role',
  //       permission: 'DEFAULT',
  //       icon: 'feather icon-home'
  //     }

  //   ]
  // },
  // ******************************************end*********************************


  // {
  //   id: 'Authentication',
  //   title: 'Authentication',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'signup',
  //       title: 'Sign up',
  //       type: 'item',
  //       url: '/auth/signup',
  //       icon: 'feather icon-at-sign',
  //       target: true,
  //       breadcrumbs: false
  //     },
  //     {
  //       id: 'signin',
  //       title: 'Sign in',
  //       type: 'item',
  //       url: '/auth/signin',
  //       icon: 'feather icon-log-in',
  //       target: true,
  //       breadcrumbs: false
  //     }
  //   ]
  // },
  // {
  //   id: 'chart',
  //   title: 'Chart',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'apexchart',
  //       title: 'ApexChart',
  //       type: 'item',
  //       url: '/chart',
  //       classes: 'nav-item',
  //       icon: 'feather icon-pie-chart'
  //     }
  //   ]
  // },
  // {
  //   id: 'forms & tables',
  //   title: 'Forms & Tables',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'forms',
  //       title: 'Basic Forms',
  //       type: 'item',
  //       url: '/forms',
  //       classes: 'nav-item',
  //       icon: 'feather icon-file-text'
  //     },
  //     {
  //       id: 'tables',
  //       title: 'tables',
  //       type: 'item',
  //       url: '/tables',
  //       classes: 'nav-item',
  //       icon: 'feather icon-server'
  //     }
  //   ]
  // },
  // {
  //   id: 'other',
  //   title: 'Other',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'sample-page',
  //       title: 'Sample Page',
  //       type: 'item',
  //       url: '/sample-page',
  //       classes: 'nav-item',
  //       icon: 'feather icon-sidebar'
  //     },
  //     {
  //       id: 'menu-level',
  //       title: 'Menu Levels',
  //       type: 'collapse',
  //       icon: 'feather icon-menu',
  //       children: [
  //         {
  //           id: 'menu-level-2.1',
  //           title: 'Menu Level 2.1',
  //           type: 'item',
  //           url: 'javascript:',
  //           external: true
  //         },
  //         {
  //           id: 'menu-level-2.2',
  //           title: 'Menu Level 2.2',
  //           type: 'collapse',
  //           children: [
  //             {
  //               id: 'menu-level-2.2.1',
  //               title: 'Menu Level 2.2.1',
  //               type: 'item',
  //               url: 'javascript:',
  //               external: true
  //             },
  //             {
  //               id: 'menu-level-2.2.2',
  //               title: 'Menu Level 2.2.2',
  //               type: 'item',
  //               url: 'javascript:',
  //               external: true
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }
];

