sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'com.devepos.apps.cflp.notificationtypesadmin',
            componentId: 'NotificationTypesObjectPage',
            entitySet: 'NotificationTypes'
        },
        CustomPageDefinitions
    );
});