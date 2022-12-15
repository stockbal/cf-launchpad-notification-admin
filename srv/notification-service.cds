@requires : 'admin'
@path     : '/notifications'
service NotificationService {
    entity Notification {
        OriginId                : String(200);
        NotificationTypeKey     : String(32);
        NotificationTypeVersion : String(20);
        NavigationTargetObject  : String;
        NavigationTargetAction  : String;
        Priority                : String(20);
        ActorId                 : String(20);
        ActorType               : String(20);
        ActorDisplayText        : String(120);
        ActorImageURL           : String;
        Properties              : array of {
            ![Key]      : String;
            Language    : String(2);
            Value       : String;
            Type        : String(20);
            IsSensitive : Boolean;
        };
        Recipients              : array of {
            RecipientId : String;
        };
        TargetParameters        : array of {
            ![Key]      : String;
            Value       : String;
        }
    }

    action createNotification(notification : Notification) returns UUID;
}
