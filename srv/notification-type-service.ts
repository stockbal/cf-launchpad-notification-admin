import { ApplicationService } from "@sap/cds";

export class NotificationTypeService extends ApplicationService {
  override async init() {
    this.before("SAVE", async req => {
      //
    });
    await super.init();
  }
}
