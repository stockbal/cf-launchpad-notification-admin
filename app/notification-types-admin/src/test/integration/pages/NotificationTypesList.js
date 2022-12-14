sap.ui.define(["sap/fe/test/ListReport"], ListReport => {
  const CustomPageDefinitions = {
    actions: {},
    assertions: {}
  };

  return new ListReport(
    {
      appId: "com.devepos.apps.cflp.notificationtypesadmin",
      componentId: "NotificationTypesList",
      entitySet: "NotificationTypes"
    },
    CustomPageDefinitions
  );
});
