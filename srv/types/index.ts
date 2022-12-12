import * as NotificationServiceTypes from "./cds/NotificationService";
import * as NotificationTypeServiceTypes from "./cds/NotificationTypeService";

/**
 * Notification Type in external OData v2 API on SAP Launchpad service
 */
interface ExternalNotificationType {
  NotificationTypeId?: string;
  NotificationTypeKey: string;
  NotificationTypeVersion: string;
  IsGroupable: boolean;
  Templates: {
    Language: string;
    TemplatePublic: string;
    TemplateSensitive: string;
    TemplateGrouped: string;
    TemplateLanguage: string;
    Subtitle: string;
  }[];
  Actions?: {
    Language: string;
    ActionId: string;
    ActionText: string;
    GroupActionText: string;
    Nature: "POSITIVE" | "NEGATIVE";
  }[];
}

/**
 * Notification Type in external OData v2 API on SAP Launchpad service
 */
interface ExternalNotification {
  OriginId?: string;
  NotificationTypeKey: string;
  NotificationTypeVersion: string;
  NavigationTargetObject?: string;
  NavigationTargetAction?: string;
  Priority?: "High" | "Medium" | "Low" | "Neutral";
  ActorId?: string;
  ActorType?: string;
  ActorDisplayText?: string;
  ActorImageURL?: string;
  Recipients: { RecipientId: string }[];
  Properties: {
    Key: string;
    Language: string;
    Type: string;
    Value: string;
    IsSensitive: boolean;
  }[];
  TargetParameters?: {
    Key: string;
    Value: string;
  }[];
}

export {
  NotificationServiceTypes,
  NotificationTypeServiceTypes,
  ExternalNotificationType,
  ExternalNotification
};
