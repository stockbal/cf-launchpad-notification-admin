import { Languages, Locale } from "./sap.common";

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
  IsGroupable?: boolean;
  TemplateLanguage?: TemplateLanguages;
  TemplateLanguage_code?: string;
  syncedNotificationTypeID: string;
  Templates: Templates[];
  Actions: Actions[];
}

export interface TemplateLanguages {
  name: string;
  descr: string;
  code: string;
  texts?: TemplateLanguagesTexts[];
  localized?: TemplateLanguagesTexts;
}

export interface TemplateLanguagesTexts {
  locale: Locale;
  name: string;
  descr: string;
  code: string;
}

export interface Templates {
  createdAt?: Date;
  createdBy?: string;
  modifiedAt?: Date;
  modifiedBy?: string;
  ID: string;
  Language: Languages;
  Language_code?: Locale;
  TemplatePublic?: string;
  TemplateSensitive: string;
  TemplateGrouped: string;
  Description: string;
  Subtitle: string;
  notificationType?: NotificationTypes;
  notificationType_ID?: string;
}

export enum Entity {
  Actions = "db.Actions",
  Natures = "db.Natures",
  NaturesTexts = "db.Natures.texts",
  NotificationTypes = "db.NotificationTypes",
  TemplateLanguages = "db.TemplateLanguages",
  TemplateLanguagesTexts = "db.TemplateLanguages.texts",
  Templates = "db.Templates"
}

export enum SanitizedEntity {
  Actions = "Actions",
  Natures = "Natures",
  NaturesTexts = "NaturesTexts",
  NotificationTypes = "NotificationTypes",
  TemplateLanguages = "TemplateLanguages",
  TemplateLanguagesTexts = "TemplateLanguagesTexts",
  Templates = "Templates"
}
