import { ApplicationService } from "@sap/cds";
import { NotificationServiceTypes as srv } from "./types";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("@sap/xsenv").loadEnv();

export class NotificationService extends ApplicationService {
  override async init() {
    this.on("createNotification", async req => {
      // TODO: create notification
      console.log(req.data as srv.Notification);

      return cds.utils.uuid();
    });
    await super.init();
  }
}
