import { Locale } from "./sap.common";

export interface Actions {
  createdAt?: Date;
  createdBy?: string;
  modifiedAt?: Date;
  modifiedBy?: string;
  ID: string;
  Language: Languages;
  Language_code?: Locale;
  ActionId: string;
  ActionText: string;
  GroupActionText: string;
  Nature?: Natures;
  Nature_code?: string;
  notificationType?: NotificationTypes;
  notificationType_ID?: string;
}

export interface Languages {
  name: string;
  descr: string;
  code: Locale;
  texts?: LanguagesTexts[];
  localized?: LanguagesTexts;
}

export interface LanguagesTexts {
  locale: Locale;
  name: string;
  descr: string;
  code: Locale;
}

export interface Natures {
  name: string;
  descr: string;
  code: string;
  texts?: NaturesTexts[];
  localized?: NaturesTexts;
}

export interface NaturesTexts {
  locale: Locale;
  name: string;
  descr: string;
  code: string;
}

export interface NotificationTypes {
  createdAt?: Date;
  createdBy?: string;
  modifiedAt?: Date;
  modifiedBy?: string;
  ID: string;
  NotificationTypeKey: string;
  NotificationTypeVersion: string;
  IsGroupable: boolean;
  syncedNotificationTypeID: string;
  Templates: Templates[];
  Actions: Actions[];
  headerTitle?: string;
}

export interface Templates {
  createdAt?: Date;
  createdBy?: string;
  modifiedAt?: Date;
  modifiedBy?: string;
  ID: string;
  Language: Languages;
  Language_code?: Locale;
  TemplatePublic: string;
  TemplateSensitive: string;
  TemplateGrouped: string;
  Description: string;
  Subtitle: string;
  TemplateLanguage: string;
  notificationType?: NotificationTypes;
  notificationType_ID?: string;
}

export enum ActionSyncFromRemote {
  name = "syncFromRemote"
}

export enum ActionSyncWithLocal {
  name = "syncWithLocal"
}

export enum Entity {
  Actions = "NotificationTypeService.Actions",
  Languages = "NotificationTypeService.Languages",
  LanguagesTexts = "NotificationTypeService.Languages.texts",
  Natures = "NotificationTypeService.Natures",
  NaturesTexts = "NotificationTypeService.Natures.texts",
  NotificationTypes = "NotificationTypeService.NotificationTypes",
  Templates = "NotificationTypeService.Templates"
}

export enum SanitizedEntity {
  Actions = "Actions",
  Languages = "Languages",
  LanguagesTexts = "LanguagesTexts",
  Natures = "Natures",
  NaturesTexts = "NaturesTexts",
  NotificationTypes = "NotificationTypes",
  Templates = "Templates"
}
