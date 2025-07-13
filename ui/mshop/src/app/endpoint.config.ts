import { environment } from "../environments/environment";
import { ConfigService } from "./config.service";

export function endpointConfig(config: ConfigService) {

    const baseDev = config?.baseDevUrl;
    const baseProd = config?.baseProdUrl;
    const client = config?.client;
    const domain = config?.domain;
    const appName = config?.appName;
    const version = config?.appVersion;

    const url = environment.production ? baseProd : baseDev;

    return {
        url: `${url}/secure`,
        url_public: `${url}/public`,
        url_admin: `${url}/secure/admin`,
        getClient: client,
        getDomain: domain,
        getVersion: version,
        getAppName: appName,
    };

}