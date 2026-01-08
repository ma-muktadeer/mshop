export class Header {
  requestId?: string;
  clientSource?: string;
  destination?: string;
  serverDestination?: string;
  locationId?: string;
  clientId?: string;
  clientName?: string;
  userId?: number;
  userName?: string;
  password?: string;
  actionType?: string;
  contentType?: string;
  senderSourceIPAddress?: string;
  senderGatewayIPAddress?: string;
  status?: string;
  statusDesc?: string;
  errorMsg?: string;
  errorCode?: number;
  comments?: string;
  reference?: string;
  callbackUrl?: Array<string>;
  requestType?: string;
  encryptedData?: boolean;
  extraInfoMap?: Record<string, string>;

  pageNumber?: number;
  pageSize?: number;

}