sap.ui.define(
  ["sap/ui/core/mvc/ControllerExtension", "../lib/NotificationTester"],
  (ControllerExtension, NotificationTester) => {
    return ControllerExtension.extend(
      "com.devepos.apps.cflp.notificationtypesadmin.ext.controller.extendOP",
      {
        async onCreateNotification(bindingContext) {
          await new NotificationTester(this.base, bindingContext).createNotification();
        }
      }
    );
  }
);
