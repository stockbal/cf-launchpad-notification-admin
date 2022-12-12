# notification-admin

Simple Fiori Elements application on top of CAP application to manage the notification types for the SAP Launchpad service.

## Configure `.env` file for API testing

Template for `.env` file

```properties
# variables communication with the launchpad notification service
authUrl=
notifUrl=
notifClientId=""
notifClientSecret=""

# email for notification receiver - i.e. the user who loggs into the launchpad site
recipientEmail=

# English properties for notification type template
TemplateSensitive=
TemplateGrouped=
TemplatePublic=
Subtitle=

# German properties for notification type template
TemplateSensitive_de=
TemplateGrouped_de=
TemplatePublic_de=
Subtitle_de=
```
