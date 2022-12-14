import { ApplicationService } from "@sap/cds";
import { NotificationServiceTypes as srv } from "./types";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access
require("@sap/xsenv").loadEnv();

export class NotificationService extends ApplicationService {
  override async init() {
    this.on("createNotification", req => {
      // TODO: create notification
      console.log(req.data as srv.Notification);

      return cds.utils.uuid();
    });
    await super.init();
  }
}
