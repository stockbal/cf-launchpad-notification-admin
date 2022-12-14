sap.ui.define(["sap/fe/test/ObjectPage"], ObjectPage => {
  const CustomPageDefinitions = {
    actions: {},
    assertions: {}
  };

  return new ObjectPage(
    {
      appId: "com.devepos.apps.cflp.notificationtypesadmin",
      componentId: "NotificationTypesObjectPage",
      entitySet: "NotificationTypes"
    },
    CustomPageDefinitions
  );
});
