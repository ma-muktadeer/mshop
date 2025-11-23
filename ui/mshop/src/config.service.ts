import { HttpClient } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { environment } from "./environments/environment";
import { isPlatformBrowser } from "@angular/common";

export interface AppConfig {
  app: {
    constantAppName: string;
    blockMultiTab?: boolean;
  };
  baseUrl: string;
  product?: {
    version: string;
  };
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config: AppConfig | undefined;

  browserName: string | undefined;
  os: string | undefined;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);

  constructor() { }

  async loadConfig(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    console.log("Loading config...");
    try {
      const url = environment.production ? '../assets/env/config.prod.json' : '../assets/env/config.json';
      this.config = await firstValueFrom(this.http.get<AppConfig>(url));
      console.log(this.config);
      this.browserName = this.getBrowserInfo();
      this.os = this.getOSInfo();
    } catch (error) {
      console.error('Could not load config file', error);
    }
  }

  get app(): any {
    return this.config?.app;
  }

  get appName(): string | undefined {
    return this.config?.app?.constantAppName;
  }

  get baseUrl(): string | undefined {
    return this.config?.baseUrl;
  }

  get blockMultiTab(): boolean {
    return this.config?.app?.blockMultiTab ?? true;
  }

  get appVersion(): string | undefined {
    return this.config?.product?.version;
  }

  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Firefox") > -1) return "Firefox";
    if (userAgent.indexOf("SamsungBrowser") > -1) return "Internet";
    if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) return "Opera";
    if (userAgent.indexOf("Trident") > -1) return "Internet";
    if (userAgent.indexOf("Edge") > -1) return "Edge";
    if (userAgent.indexOf("Chrome") > -1) return "Chrome";
    if (userAgent.indexOf("Safari") > -1) return "Safari";
    return "Unknown";
  }

  private getOSInfo(): string {
    const platform = navigator.platform;
    if (platform.indexOf("Win") > -1) return "Windows";
    if (platform.indexOf("Mac") > -1) return "MacOS";
    if (platform.indexOf("X11") > -1) return "UNIX";
    if (platform.indexOf("Linux") > -1) return "Linux";
    if (/Android/.test(navigator.userAgent)) return "Android";
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) return "iOS";
    return "Unknown";
  }
}

export async function initializeApplication(configService: ConfigService) {
  return await configService.loadConfig();
}
