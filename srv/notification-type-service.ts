import { ApplicationService } from "@sap/cds";
import { AxiosError } from "axios";
import { ExtNotificationTypeService } from "./lib/api/notification-type";
import { NotificationTypeServiceTypes as srv, ExternalNotificationType, DbTypes } from "./types";

export class NotificationTypeService extends ApplicationService {
  override async init() {
    this.before("SAVE", async req => {
      const notificationType = req.data as srv.NotificationTypes;
      if (!notificationType?.Templates.length) {
        // at least 1 notification type has to exist
        req.reject(422, "NT_NO_TEMPLATES_PROVIDED");
      }

      notificationType.TemplateLanguage_code = notificationType.TemplateLanguage_code || "";

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
        .where({ ID: req.data.ID })) as Pick<srv.NotificationTypes, "syncedNotificationTypeID">;

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

    this.on("syncFromRemote", async req => {
      const params = req.data as srv.ActionSyncFromRemoteParams;

      const extNotificationTypes = await ExtNotificationTypeService.getNotificationTypes();

      const localNotificationTypes = (await SELECT.from(
        DbTypes.Entity.NotificationTypes
      )) as srv.NotificationTypes[];

      const extTypesToCreate = [] as srv.NotificationTypes[];
      let extTypesSkipCount = 0;
      let extTypesSyncCount = 0;
      const localNotifTypesToDelete: string[] = [];

      for (const extType of extNotificationTypes) {
        let isCreateFromExt = true;
        for (const lt of localNotificationTypes) {
          if (
            lt.NotificationTypeKey === extType.NotificationTypeKey &&
            lt.NotificationTypeVersion === extType.NotificationTypeVersion
          ) {
            if (lt.syncedNotificationTypeID !== extType.NotificationTypeId) {
              if (params.overwriteLocal) {
                localNotifTypesToDelete.push(lt.ID);
              } else {
                extTypesSkipCount++;
                isCreateFromExt = false;
              }
              break;
            } else {
              isCreateFromExt = false; // already exists and is synced
              break;
            }
          }
        }
        if (isCreateFromExt) {
          extTypesToCreate.push({
            NotificationTypeKey: extType.NotificationTypeKey,
            NotificationTypeVersion: extType.NotificationTypeVersion,
            IsGroupable: extType.IsGroupable,
            syncedNotificationTypeID: extType.NotificationTypeId,
            createdBy: "Launchpad"
          } as srv.NotificationTypes);
          extTypesSyncCount++;
        }
      }

      if (localNotifTypesToDelete.length > 0) {
        await DELETE.from(DbTypes.Entity.NotificationTypes).where({
          ID: { in: localNotifTypesToDelete }
        });
      }
      if (extTypesSyncCount) {
        await INSERT.into(DbTypes.Entity.NotificationTypes).entries(extTypesToCreate);
      }

      if (extNotificationTypes.length > 0) {
        req.notify(200, "NT_SYNC_ACTION", undefined, [
          extTypesSyncCount,
          extNotificationTypes.length
        ]);
      } else {
        req.notify(304, "NT_SYNC_ACTION_NO_EXT_TYPES");
      }
    });

    await super.init();
  }
}
