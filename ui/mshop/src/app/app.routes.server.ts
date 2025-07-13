import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: ':loginName/**',
    renderMode: RenderMode.Client,
    // fallback: PrerenderFallback.Client,
    // async getPrerenderParams() {
    //   const dataService = inject(CommonService);
    //   const loginName = await dataService.loadLoginUser()?.loginName;
    //   return [{ loginName: loginName }];
    // },
  }
];
