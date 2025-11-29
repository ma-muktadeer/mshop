import { RequestBody } from "../constants/RequestBody";

export interface Service {

    onResponse(service: Service, req: RequestBody<any>, res: any);
    onError(service: Service, req: RequestBody<any>, res: any);

}
