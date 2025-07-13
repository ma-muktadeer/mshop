import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Inject, inject, Injectable, PLATFORM_ID } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: any;

    browserName;
    os

    constructor(@Inject(PLATFORM_ID) private platformId: object) { }

    async loadConfig(): Promise<void> {
        if (isPlatformBrowser(this.platformId)) {
            const http = inject(HttpClient);
            console.log("Loading config...");
            try {
                const config = await firstValueFrom(http.get('../assets/env/config.json'));
                this.config = config;
                console.log(this.config);
                this.browserName = this.getBrowserInfo();
                this.os = this.getOSInfo()
            } catch (error) {
                console.error('Could not load config file', error);
            }
            // Browser-only code
        }
        return this.config;
    }

    get baseDevUrl() {
        return this.config?.app.baseDevUrl;
    }
    get baseProdUrl() {
        return this.config?.app.baseProdUrl;
    }
    get appName() {
        return this.config?.app.appName;
    }
    get appVersion() {
        return this.config?.app?.version
    }
    get domain() {
        return this.config?.app?.domain
    }
    get client() {
        return this.config?.app?.client
    }



    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browserName;

        if (userAgent.indexOf("Firefox") > -1) {
            browserName = "Firefox";
        } else if (userAgent.indexOf("SamsungBrowser") > -1) {
            browserName = "Internet";
        } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
            browserName = "Opera";
        } else if (userAgent.indexOf("Trident") > -1) {
            browserName = "Internet";
        } else if (userAgent.indexOf("Edge") > -1) {
            browserName = "Edge";
        } else if (userAgent.indexOf("Chrome") > -1) {
            browserName = "Chrome";
        } else if (userAgent.indexOf("Safari") > -1) {
            browserName = "Safari";
        } else {
            browserName = "Unknown";
        }

        return browserName;
    }

    getOSInfo() {
        const platform = navigator.platform;
        let osName;

        if (platform.indexOf("Win") > -1) {
            osName = "Windows";
        } else if (platform.indexOf("Mac") > -1) {
            osName = "MacOS";
        } else if (platform.indexOf("X11") > -1) {
            osName = "UNIX";
        } else if (platform.indexOf("Linux") > -1) {
            osName = "Linux";
        } else if (/Android/.test(navigator.userAgent)) {
            osName = "Android";
        } else if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            osName = "iOS";
        } else {
            osName = "Unknown";
        }

        return osName;
    }
}


export function initializeApplication(configService: ConfigService) {
    return configService.loadConfig();
}
