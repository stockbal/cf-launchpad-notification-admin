import { ApplicationService } from "@sap/cds";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("@sap/xsenv").loadEnv();

export class NotificationService extends ApplicationService {
  override async init() {
    await super.init();
  }
}
