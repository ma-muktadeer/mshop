import { Constants } from "../constants/Constants";

export class Ithouse {

  public isOK(response: any): boolean {
    if (!response || !response.header) {
      return false;
    }
    return response.header.status == Constants.STR_OK;
  }
  public getErrorMsg(response: any): any {
    if (!response || !response.header) {
      return 'Server returned an invalid response';
    }
    return response.header.errorMsg || 'Unknown error occurred';
  }
}
