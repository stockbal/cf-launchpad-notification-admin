sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/devepos/apps/cflp/notificationtypesadmin/test/integration/FirstJourney',
		'com/devepos/apps/cflp/notificationtypesadmin/test/integration/pages/NotificationTypesList',
		'com/devepos/apps/cflp/notificationtypesadmin/test/integration/pages/NotificationTypesObjectPage',
		'com/devepos/apps/cflp/notificationtypesadmin/test/integration/pages/TemplatesObjectPage'
    ],
    function(JourneyRunner, opaJourney, NotificationTypesList, NotificationTypesObjectPage, TemplatesObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/devepos/apps/cflp/notificationtypesadmin') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheNotificationTypesList: NotificationTypesList,
					onTheNotificationTypesObjectPage: NotificationTypesObjectPage,
					onTheTemplatesObjectPage: TemplatesObjectPage
                }
            },
            opaJourney.run
        );
    }
);