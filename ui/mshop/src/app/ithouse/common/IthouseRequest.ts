import { ActionType } from "../constants/action-type.enum";
import { ContentType } from "../constants/content-type.enum";
import { Service } from "./service";

export class IthouseRequest{

    service : Service;
    actionType :ActionType;
    contentType : ContentType;
    referance: string;
    payload : any;

    get getService(){
        return this.service;
    }
    set setService(service : Service){
        this.service = service;
    }

    get getActionType(){
        return this.actionType;
    }
    set setActionType(actionType :ActionType){
        this.actionType = actionType;
    }

    get getContentType(){
        return this.contentType;
    }
    set setContentType(contentType :ContentType){
        this.contentType = contentType;
    }

    get getReferance(){
        return this.referance;
    }
    set setReferance(referance :string){
        this.referance = referance;
    }

    get getPayload(){
        return this.payload;
    }
    set setPayload(payload :any){
        this.payload = payload;
    }
}