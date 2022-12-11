import * as NotificationServiceTypes from "./cds/NotificationService";
import * as NotificationTypeServiceTypes from "./cds/NotificationTypeService";

interface NotificationType {
  NotificationTypeId: string;
  NotificationTypeKey: string;
  NotificationTypeVersion: string;
  Templates: {
    Language: string;
    TemplatePublic: string;
    TemplateSensitive: string;
    TemplateGrouped: string;
    TemplateLanguage: string;
    Subtitle: string;
  }[];
}

export {
  NotificationServiceTypes,
  NotificationTypeServiceTypes,
  NotificationType,
};
