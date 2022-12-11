sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'com.devepos.apps.cflp.notificationtypesadmin',
            componentId: 'NotificationTypesList',
            entitySet: 'NotificationTypes'
        },
        CustomPageDefinitions
    );
});