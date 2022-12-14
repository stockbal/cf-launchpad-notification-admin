using {db} from '../db/schema';
using {sap} from '@sap/cds/common';

@requires: 'admin'
@path    : '/notification-types'
service NotificationTypeService {

    action syncFromRemote(overwriteLocal : Boolean @title: '{i18n>NotificationType_Actions_syncFromRemote_Params_overwrite}' );

    @odata.draft.enabled
    entity NotificationTypes as projection on db.NotificationTypes {
        *,
        NotificationTypeKey || '-' || NotificationTypeVersion as headerTitle : String

    };
}
