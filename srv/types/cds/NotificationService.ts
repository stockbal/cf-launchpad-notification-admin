export interface Notification {
  OriginId: string;
  NotificationTypeKey: string;
  NotificationTypeVersion: string;
  NavigationTargetObject: string;
  NavigationTargetAction: string;
  Priority: string;
  ActorId: string;
  ActorType: string;
  ActorDisplayText: string;
  ActorImageURL: string;
  Properties: unknown[];
  Recipients: unknown[];
  TargetParameters: unknown[];
}

export enum ActionCreateNotification {
  name = "createNotification",
  paramNotification = "notification"
}

export interface ActionCreateNotificationParams {
  notification: Notification;
}

export type ActionCreateNotificationReturn = string;

export enum Entity {
  Notification = "NotificationService.Notification"
}

export enum SanitizedEntity {
  Notification = "Notification"
}
