import { ApplicationService } from "@sap/cds";
import { AxiosError } from "axios";
import { ExtNotificationTypeService } from "./lib/api/notification-type";
import { NotificationTypeServiceTypes as srv, ExternalNotificationType } from "./types";

export class NotificationTypeService extends ApplicationService {
  override async init() {
    this.before("SAVE", async req => {
      const notificationType = req.data as srv.NotificationTypes;
      if (!notificationType?.Templates.length) {
        // at least 1 notification type has to exist
        req.reject(422, "NT_NO_TEMPLATES_PROVIDED");
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

    this.before("DELETE", async req => {
      console.log(req.data);

      const notificationType = (await SELECT.one
        .from(req.target)
        .columns("syncedNotificationTypeID")
        .where({ ID: (req.data as any).ID })) as Pick<
        srv.NotificationTypes,
        "syncedNotificationTypeID"
      >;

      if (notificationType?.syncedNotificationTypeID) {
        // delete notification type from external service
        try {
          await ExtNotificationTypeService.deleteNotificationType(
            notificationType.syncedNotificationTypeID
          );
        } catch (error) {
          if (error instanceof AxiosError && error.response?.status !== 404) {
            throw error;
          }
        }
      }
    });
    await super.init();
  }
}
