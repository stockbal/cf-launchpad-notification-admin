import ControllerExtension from "sap/ui/core/mvc/ControllerExtension";
import Context from "sap/ui/model/odata/v4/Context";

import NotificationTester from "../lib/NotificationTester";

/**
 * @namespace com.devepos.apps.cflp.notificationtypesadmin.ext.controller
 */
export default class extendOP extends ControllerExtension {
  async onCreateNotification(context: Context) {
    await new NotificationTester(
      (this as any).base,
      context
    ).createNotification();
  }
}
