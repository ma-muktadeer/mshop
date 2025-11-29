import { RequestBody } from "../ithouse/constants/RequestBody";

export interface Service {

    onResponse(service: Service, req: RequestBody<any>, res: any);
    onError(service: Service, req: RequestBody<any>, res: any);

}
