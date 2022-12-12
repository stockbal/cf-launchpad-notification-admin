using NotificationTypeService as service from '../../srv/notification-type-service';

annotate service.NotificationTypes with @fiori.draft.enabled;

annotate service.NotificationTypes with @( //
UI : {
    HeaderInfo          : {
        $Type          : 'UI.HeaderInfoType',
        TypeName       : '{i18n>NotificationType_Type_Title}',
        TypeNamePlural : '{i18n>NotificationType_Type_TitlePlural}',
        Title          : {Value : headerTitle},
    },
    LineItem            : [
        {Value : NotificationTypeKey},
        {Value : NotificationTypeVersion},
        {Value : IsGroupable},
        {
            $Type  : 'UI.DataFieldForAction',
            Action : 'NotificationTypeService.EntityContainer/syncFromRemote',
            Label  : '{i18n>NotificationType_actions_syncFromRemote}',
        },
        {
            $Type  : 'UI.DataFieldForAction',
            Action : 'NotificationTypeService.EntityContainer/syncWithLocal',
            Label  : '{i18n>NotificationType_actions_syncWithLocal}',
        }
    ],
    FieldGroup #General : {Data : [
        {Value : NotificationTypeVersion},
        {Value : NotificationTypeKey},
        {Value : IsGroupable},
        {Value : TemplateLanguage_code}
    ]},
    FieldGroup #Admin   : {Data : [
        {Value : createdBy},
        {Value : createdAt},
        {Value : modifiedBy},
        {Value : modifiedAt}
    ]},
    Facets              : [
        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'General',
            Label  : '{i18n>Facets_General_Label}',
            Target : '@UI.FieldGroup#General'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>NotificationType_Type_Facets_Templates_Label}',
            Target : 'Templates/@UI.LineItem'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>NotificationType_Type_Facets_Actions_Label}',
            Target : 'Actions/@UI.LineItem'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Facets_Admin_Label}',
            Target : '@UI.FieldGroup#Admin'
        },
    ]
}) {
    syncedNotificationTypeID @UI.HiddenFilter;
    headerTitle              @UI.HiddenFilter;

    TemplateLanguage         @(
        Common.ValueListWithFixedValues,
        Common.Text            : TemplateLanguage.name,
        Common.TextArrangement : #TextOnly
    );
};

annotate service.Templates with @( //
UI : {
    HeaderInfo           : {
        TypeName       : '{i18n>NotificationType_Template_Title}',
        TypeNamePlural : '{i18n>NotificationType_Template_TitlePlural}',
        Title          : {Value : Language_code}
    },
    FieldGroup #General  : {Data : [
        {Value : Language_code},
        {Value : Description}
    ]},
    FieldGroup #Template : {Data : [
        {Value : TemplatePublic},
        {Value : TemplateSensitive},
        {Value : TemplateGrouped},
        {Value : Subtitle}
    ]},
    LineItem             : [
        {Value : Language_code},
        {Value : TemplatePublic},
        {Value : TemplateSensitive},
        {Value : TemplateGrouped},
        {Value : Subtitle},
        {Value : Description}
    ],
    Facets               : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Facets_General_Label}',
            Target : '@UI.FieldGroup#General'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>NotificationType_Template_Facets_Texts_Label}',
            Target : '@UI.FieldGroup#Template'
        }
    ],
}) {
    Language          @(
        Common.ValueListWithFixedValues,
        Common.Text            : Language.name,
        Common.TextArrangement : #TextOnly
    );

    TemplatePublic    @UI.MultiLineText;
    TemplateSensitive @UI.MultiLineText;
    TemplateGrouped   @UI.MultiLineText;
    Subtitle          @UI.MultiLineText;
    Description       @UI.MultiLineText;
};

annotate service.Actions with @( //
UI : {
    HeaderInfo : {
        TypeName       : '{i18n>NotificationType_Action_Title}',
        TypeNamePlural : '{i18n>NotificationType_Action_TitlePlural}',
        Title          : {Value : ActionId}
    },
    LineItem   : [
        {
            Value             : ActionId,
            ![@UI.Importance] : #High
        },
        {
            Value             : Language_code,
            ![@UI.Importance] : #High
        },
        {
            Value             : ActionText,
            ![@UI.Importance] : #High
        },
        {
            Value             : GroupActionText,
            ![@UI.Importance] : #High
        },
        {
            Value             : Nature_code,
            ![@UI.Importance] : #High
        }
    ]
}) {
    Language @(
        Common.ValueListWithFixedValues,
        Common.Text            : Language.name,
        Common.TextArrangement : #TextOnly,
    );

    Nature   @(
        Common.ValueListWithFixedValues,
        Common.Text            : Nature.name,
        Common.TextArrangement : #TextOnly
    )
};

annotate service.Natures {
    code @(
        Common.Text            : name,
        Common.TextArrangement : #TextOnly
    )
};

annotate service.TemplateLanguages {
    code @(
        Common.Text            : name,
        Common.TextArrangement : #TextOnly
    )
}


annotate service.Actions {
    notificationType @UI.Hidden;
    ID               @UI.Hidden;
};

annotate service.Templates {
    ID               @UI.Hidden;
    notificationType @UI.Hidden;
};
