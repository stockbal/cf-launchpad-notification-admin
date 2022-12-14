export interface NavigationTargetParams {
  Key: string;
  NotificationId: string;
  Value: string;
}

export interface NotifcationProperties {
  Key: string;
  NotificationId: string;
  Language: string;
  Value: string;
  Type: string;
  IsSensitive: boolean;
}

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

export interface Notifications {
  Id: string;
  OriginId: string;
  NotificationTypeId: string;
  NotificationTypeKey: string;
  NotificationTypeVersion: string;
  NavigationTargetObject: string;
  NavigationTargetAction: string;
  Priority: string;
  ProviderId: string;
  ActorId: string;
  ActorType: string;
  ActorDisplayText: string;
  ActorImageURL: string;
  Recipients: Recipients[];
  Properties: NotifcationProperties[];
  TargetParameters: NavigationTargetParams[];
}

export interface Recipients {
  RecipientId: string;
  NotificationId: string;
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
  NavigationTargetParams = "NotificationService.NavigationTargetParams",
  NotifcationProperties = "NotificationService.NotifcationProperties",
  Notification = "NotificationService.Notification",
  Notifications = "NotificationService.Notifications",
  Recipients = "NotificationService.Recipients"
}

export enum SanitizedEntity {
  NavigationTargetParams = "NavigationTargetParams",
  NotifcationProperties = "NotifcationProperties",
  Notification = "Notification",
  Notifications = "Notifications",
  Recipients = "Recipients"
}
