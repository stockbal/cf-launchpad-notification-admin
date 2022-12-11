using {db} from '../db/schema';
using {sap} from '@sap/cds/common';

@requires : 'admin'
@path     : '/notification-types'
service NotificationTypeService {

    action syncFromRemote();
    action syncWithLocal();

    @odata.draft.enabled
    entity NotificationTypes as projection on db.NotificationTypes {
        *,
        NotificationTypeKey || '-' || NotificationTypeVersion as headerTitle : String

    };

    @readonly
    entity Natures           as projection on db.Natures;
}
