import { ApplicationService } from "@sap/cds";
import { ExtNotificationTypeService } from "./lib/api/notification-type";
import { NotificationTypeServiceTypes as srv, ExternalNotificationType } from "./types";

export class NotificationTypeService extends ApplicationService {
  override async init() {
    this.before("SAVE", async req => {
      const notificationType = req.data as srv.NotificationTypes;
      if (!notificationType?.Templates.length) {
        // at least 1 notification type has to exist
        req.reject(422, "NT_NO_TEMPLATES_PROVIDED", "NotificationType");
      }

      // map type to external API
      const externalNotificationType = {
        NotificationTypeVersion: notificationType.NotificationTypeVersion,
        NotificationTypeKey: notificationType.NotificationTypeKey,
        IsGroupable: !!notificationType.IsGroupable,
        Templates: notificationType.Templates.map(t => ({
          Language: t.Language_code,
          Subtitle: t.Subtitle,
          TemplatePublic: t.TemplatePublic,
          TemplateGrouped: t.TemplateGrouped,
          TemplateSensitive: t.TemplateSensitive,
          TemplateLanguage: notificationType.TemplateLanguage_code
        })),
        Actions: notificationType.Actions?.map(a => ({
          ActionId: a.ActionId,
          ActionText: a.ActionText,
          GroupActionText: a.GroupActionText,
          Language: a.Language_code,
          Nature: a.Nature_code
        }))
      } as ExternalNotificationType;

      console.log(externalNotificationType);

      if (notificationType.syncedNotificationTypeID) {
        await ExtNotificationTypeService.deleteNotificationType(
          notificationType.syncedNotificationTypeID
        );
      }
      const syncedNotificationType = await ExtNotificationTypeService.createNotificationType(
        externalNotificationType
      );
      if (syncedNotificationType?.NotificationTypeId) {
        notificationType.syncedNotificationTypeID = syncedNotificationType.NotificationTypeId;
      }
    });
    await super.init();
  }
}
