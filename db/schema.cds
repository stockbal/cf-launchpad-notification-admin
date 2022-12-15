using {
    managed,
    cuid,
    Language,
    sap.common.CodeList,
    sap.common.Locale
} from '@sap/cds/common';

namespace db;

entity NotificationTypes : managed, cuid {
    @title : '{i18n>NotificationType_Type_Key_title}'
    @mandatory
    NotificationTypeKey      : String(32);
    @title : '{i18n>NotificationType_Type_Version_title}'
    @mandatory
    NotificationTypeVersion  : String(20);
    @title : '{i18n>NotificationType_Type_IsGroupable_title}'
    IsGroupable              : Boolean default false;
    @title : '{i18n>NotificationType_Type_TemplateLanguage_title}'
    TemplateLanguage         : Association to TemplateLanguages;
    syncedNotificationTypeID : UUID;
    Templates                : Composition of many Templates
                                   on Templates.notificationType = $self;
    Actions                  : Composition of many Actions
                                   on Actions.notificationType = $self;
};

entity Templates : managed, cuid {
    @mandatory
    Language          : Language;
    @title : '{i18n>NotificationType_Template_Public_title}'
    TemplatePublic    : String(250) default '';
    @title : '{i18n>NotificationType_Template_Sensitive_title}'
    @mandatory
    TemplateSensitive : String(250) not null;
    @title : '{i18n>NotificationType_Template_Grouped_title}'
    @mandatory
    TemplateGrouped   : String(250) not null;
    @title : '{i18n>NotificationType_Template_Description_title}'
    Description       : String(250);
    @title : '{i18n>NotificationType_Template_Subtitle_title}'
    @mandatory
    Subtitle          : LargeString not null;
    notificationType  : Association to NotificationTypes;
};

entity Actions : managed, cuid {
    @mandatory
    Language         : Language;
    @title : '{i18n>NotificationType_Action_Id_title}'
    @mandatory
    ActionId         : String(32) not null;
    @title : '{i18n>NotificationType_Action_Text_title}'
    ActionText       : String(40);
    @title : '{i18n>NotificationType_Action_GroupText_title}'
    GroupActionText  : String(40);
    @title : '{i18n>NotificationType_Action_Nature_title}'
    @mandatory
    Nature           : Association to Natures;
    notificationType : Association to NotificationTypes;
};

entity Natures : CodeList {
    key code : String(20);
}

entity TemplateLanguages : CodeList {
    key code : String(20);
}
