import { AppPermission } from "../../../ithouse/services/permissioin-store.service";

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  isHidden?: boolean;
  translate?: string;
  icon?: string;
  hidden?: boolean;
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
        url: '/:loginName/dashboard',
        permission: 'DEFAULT',
        icon: 'feather icon-home'
      }
    ]
  },
  {
    id: 'admin',
    title: 'Admin',
    type: 'group',
    icon: 'feather icon-box',
    permission: [
      AppPermission.USER_MAKER,
      AppPermission.VIEW_PERMISSION,
      AppPermission.VIEW_ROLE,
      AppPermission.USER_VIEWER,
      AppPermission.VIEW_BRANCH,
      AppPermission.VIEW_RM_CODE,
      AppPermission.VIEW_BANK,
    ],
    children: [
      {
        id: 'admin-basic',
        title: 'Admin',
        type: 'collapse',
        permission: 'DEFAULT',
        icon: 'feather icon-shield',
        children: [
          {
            id: 'user',
            title: 'Add User',
            permission: [
              AppPermission.USER_MAKER,
            ],
            type: 'item',
            url: '/profile'
          },
          {
            id: 'user-list',
            title: 'User List',
            permission: [
              AppPermission.USER_VIEWER,
            ],
            type: 'item',
            url: '/admin/user-list',
          },
          {
            id: 'permission-list',
            title: 'Permission List',
            permission: [
              AppPermission.VIEW_PERMISSION,
            ],
            type: 'item',
            url: '/:loginName/admin/permission'
          },
          {
            id: 'bank-list',
            title: 'Bank List',
            permission: [
              AppPermission.VIEW_BANK,
            ],
            type: 'item',
            url: '/admin/banks'
          },
          {
            id: 'branch',
            title: 'Branch',
            permission: [
              AppPermission.VIEW_BRANCH,
            ],
            type: 'item',
            url: '/admin/branch'
          },
          {
            id: 'role-list',
            title: 'Role List',
            permission: [
              AppPermission.VIEW_ROLE,
            ],
            type: 'item',
            url: '/admin/role-list'
          },
          {
            id: 'rm-code',
            title: 'RM Code',
            permission: [
              AppPermission.VIEW_RM_CODE,
            ],
            type: 'item',
            url: '/admin/rm-code'
          }
        ]
      }
    ]
  },
  {
    id: 'appcon',
    title: 'Application Config',
    type: 'group',
    icon: 'feather icon-bookmark',
    permission: [
      AppPermission.USER_MAKER,
      AppPermission.VIEW_PROFIT_MARGIN,
      AppPermission.VIEW_DESIGNATION,
      AppPermission.VIEW_BUSINESS_TYPE,
      AppPermission.VIEW_PROFESSION_TYPE,
      AppPermission.VIEW_DOCUMENT,
    ],
    children: [
      {
        id: 'app-basic',
        title: 'App Config',
        type: 'collapse',
        permission: 'DEFAULT',
        icon: 'feather icon-settings',
        children: [
          {
            id: 'professions',
            title: 'Profession',
            permission: [
              AppPermission.VIEW_PROFESSION_TYPE,
            ],
            type: 'item',
            url: '/admin/professions'
          },
          {
            id: 'business_type',
            title: 'Business Type',
            permission: [
              AppPermission.VIEW_BUSINESS_TYPE,
            ],
            type: 'item',
            url: '/admin/business-type'
          },
          {
            id: 'designation_type',
            title: 'Designation',
            permission: [
              AppPermission.VIEW_DESIGNATION,
            ],
            type: 'item',
            url: '/admin/designation-type'
          },
          {
            id: 'document_list',
            title: 'Document Config',
            permission: [
              AppPermission.VIEW_DOCUMENT,
            ],
            type: 'item',
            url: '/admin/document-configuration'
          },
          {
            id: 'profit-margin',
            title: 'Profit-Margin',
            permission: [
              AppPermission.VIEW_PROFIT_MARGIN,
            ],
            type: 'item',
            url: '/admin/profit-margin'
          },

        ]
      }
    ]
  },
  {
    id: 'loan',
    title: 'Loan',
    type: 'group',
    icon: 'feather icon-box',
    permission: [
      AppPermission.VIEW_LOAN,
    ],
    children: [
      {
        id: 'ln',
        title: 'Loan',
        type: 'collapse',
        permission: 'DEFAULT',
        icon: 'feather icon-clock',
        children: [
          {
            id: 'creat-ln',
            title: 'Creat Loan',
            permission: [
              AppPermission.SAVE_LOAN,
            ],
            type: 'item',
            url: '/loan/creat-loan'
          },
          {
            id: 'ln-list',
            title: 'Loan List',
            permission: [
              AppPermission.VIEW_LOAN,
              AppPermission.SAVE_LOAN,
            ],
            type: 'item',
            url: '/loan/list'
          },

        ]
      }
    ]
  },





  // {
  //   id: 'other',
  //   title: 'Other',
  //   type: 'group',
  //   permission: 'DEFAULT',
  //   icon: 'icon-group',
  //   children: [
  //     // {
  //     //   id: 'transction',
  //     //   title: 'Tranction-List',
  //     //   type: 'item',
  //     //   permission: [
  //     //     AppPermission.VIEW_TRANSACTION,
  //     //   ],
  //     //   url: '/admin/transction',
  //     //   icon: 'icon-list'
  //     //   // external: true
  //     // },
  //     // {
  //     //   id: 'sample-page',
  //     //   title: 'Sample Page',
  //     //   type: 'item',
  //     //   permission: 'DEFAULT',
  //     //   url: '/sample-page',
  //     //   classes: 'nav-item',
  //     //   icon: 'feather icon-sidebar'
  //     // },
  //     // {
  //     //   id: 'menu-level',
  //     //   title: 'Transction',
  //     //   permission: 'DEFAULT',
  //     //   type: 'collapse',
  //     //   icon: 'feather icon-menu',
  //     //   children: [
  //         // {
  //         //   id: 'transction',
  //         //   title: 'Tranction-List',
  //         //   permission: 'DEFAULT',
  //         //   type: 'item',
  //         //   url: '/admin/transction',
  //         //   external: true
  //         // },
  //         // {
  //         //   id: 'menu-level-2.2',
  //         //   title: 'Menu Level 2.2',
  //         //   permission: 'DEFAULT',
  //         //   type: 'collapse',
  //         //   children: [
  //         //     {
  //         //       id: 'menu-level-2.2.1',
  //         //       title: 'Menu Level 2.2.1',
  //         //       permission: 'DEFAULT',
  //         //       type: 'item',
  //         //       url: 'javascript:',
  //         //       external: true
  //         //     },
  //         //     {
  //         //       id: 'menu-level-2.2.2',
  //         //       title: 'Menu Level 2.2.2',
  //         //       type: 'item',
  //         //       permission: 'DEFAULT',
  //         //       url: 'javascript:',
  //         //       external: true
  //         //     }
  //         //   ]
  //         // }
  //     //   ]
  //     // },
  //     // {
  //     //   id: 'reports',
  //     //   title: 'Reports',
  //     //   type: 'collapse',
  //     //   permission: 'DEFAULT',
  //     //   icon: 'feather icon-menu',
  //     //   children: [
  //     //     {
  //     //       id: 'report-1',
  //     //       title: 'Report 1',
  //     //       type: 'item',
  //     //       permission: 'DEFAULT',
  //     //       url: '/admin/my-component',
  //     //       external: true
  //     //     },
  //     //     {
  //     //       id: 'report-2',
  //     //       title: 'Report 2',
  //     //       type: 'item',
  //     //       permission: 'DEFAULT',
  //     //       url: '/admin/my-component',
  //     //       external: true
  //     //     },
  //     //     {
  //     //       id: 'report-3',
  //     //       title: 'Report 3',
  //     //       type: 'item',
  //     //       permission: 'DEFAULT',
  //     //       url: '/admin/my-component',
  //     //       external: true
  //     //     },
  //     //     {
  //     //       id: 'report-4',
  //     //       title: 'Report 4',
  //     //       type: 'item',
  //     //       permission: 'DEFAULT',
  //     //       url: '/admin/my-component',
  //     //       external: true
  //     //     },

  //     //   ]
  //     // }
  //   ]
  // },

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
];
