@requires : 'admin'
@path: '/notifications'
service NotificationService {
    entity Notifications {
        key Id                        : UUID;
            OriginId                  : String(200);
            NotificationTypeId        : UUID;
            NotificationTypeKey       : String(32);
            NotificationTypeVersion   : String(20);
            NavigationTargetObject    : String;
            NavigationTargetAction    : String;
            Priority                  : String(20);
            ProviderId                : String(32);
            ActorId                   : String(20);
            ActorType                 : String(20);
            ActorDisplayText          : String(120);
            ActorImageURL             : String;
            NotificationTypeTimestamp : Timestamp;
            Requester                 : String;
            Recipients                : Composition of many Recipients
                                            on Recipients.NotificationId = $self.Id;
            Properties                : Composition of many NotifcationProperties
                                            on Properties.NotificationId = $self.Id;

            TargetParameters          : Composition of many NavigationTargetParams
                                            on TargetParameters.NotificationId = $self.Id
    }

    entity Recipients {
        key RecipientId    : String;
        key NotificationId : UUID;
    }

    entity NotifcationProperties {
        key ![Key]         : String;
        key NotificationId : UUID;
        key Language       : String(2);
            Value          : String;
            Type           : String(20);
            IsSensitive    : Boolean;
    }

    entity NavigationTargetParams {
        key ![Key]         : String;
        key NotificationId : UUID;
            Value          : String;
    }
}
