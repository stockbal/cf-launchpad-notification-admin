import { ApplicationService } from "@sap/cds";
import { ExtNotificationService } from "./lib/api/notification";
import { NotificationServiceTypes as srv } from "./types";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access
require("@sap/xsenv").loadEnv();

export class NotificationService extends ApplicationService {
  override async init() {
    this.on("createNotification", async req => {
      return ExtNotificationService.createNotification(req.data.notification as srv.Notification);
    });
    await super.init();
  }
}
