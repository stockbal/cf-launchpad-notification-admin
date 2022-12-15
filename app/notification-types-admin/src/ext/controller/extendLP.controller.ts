import ControllerExtension from "sap/ui/core/mvc/ControllerExtension";
import MessageBox from "sap/m/MessageBox";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import Context from "sap/ui/model/odata/v4/Context";

import NotificationTester from "../lib/NotificationTester";

/**
 * @namespace com.devepos.apps.cflp.notificationtypesadmin.ext.controller
 */
export default class extendLP extends ControllerExtension {
  async onCreateNotification(_bindingContext: ODataContextBinding, contexts: Context[]) {
    if (contexts.length !== 1) {
      MessageBox.information("Only one notification type selection allowed");
      return;
    }

    await new NotificationTester((this as any).base, contexts[0]).createNotification();
  }
}
