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
  NotificationTypeTimestamp: Date;
  Requester: string;
  Recipients: Recipients[];
  Properties: NotifcationProperties[];
  TargetParameters: NavigationTargetParams[];
}

export interface Recipients {
  RecipientId: string;
  NotificationId: string;
}

export enum Entity {
  NavigationTargetParams = "NotificationService.NavigationTargetParams",
  NotifcationProperties = "NotificationService.NotifcationProperties",
  Notifications = "NotificationService.Notifications",
  Recipients = "NotificationService.Recipients"
}

export enum SanitizedEntity {
  NavigationTargetParams = "NavigationTargetParams",
  NotifcationProperties = "NotifcationProperties",
  Notifications = "Notifications",
  Recipients = "Recipients"
}
