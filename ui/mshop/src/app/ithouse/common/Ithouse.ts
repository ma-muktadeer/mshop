import { IthouseBackendService } from "../../layout/service/IthouseBackendService";
import { app } from "./App";
import { Constants } from "./Constants";

export class Ithouse extends IthouseBackendService {
    
    constructor(){
        super();
    }
    public static usre = {}

    public app = app;

    public isOK(response: any) : boolean{
        return response.header.status == Constants.STR_OK;
    }
    public getErrorMsg(response: any) : any{
        return response.header.errorMsg;
    }

}