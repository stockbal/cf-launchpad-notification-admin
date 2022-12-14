sap.ui.define(
  ["sap/ui/core/mvc/ControllerExtension", "sap/m/MessageBox", "../lib/NotificationTester"],
  (ControllerExtension, MessageBox, NotificationTester) => {
    return ControllerExtension.extend(
      "com.devepos.apps.cflp.notificationtypesadmin.ext.controller.extendLP",
      {
        async onCreateNotification(_bindingContext, contexts) {
          if (contexts.length !== 1) {
            MessageBox.information("Only one notification type selection allowed");
            return;
          }

          await new NotificationTester(this.base, contexts[0]).createNotification();
        }
      }
    );
  }
);
