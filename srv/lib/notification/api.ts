import { executeHttpRequest, HttpResponse } from "@sap-cloud-sdk/http-client";

import { NotificationServiceTypes as srv, NotificationType } from "../../types";
import { createError } from "../axios";
import { getCachedDestination } from "../destination";
import { getLogger } from "../log";

const DESTINATION_NAME = "SAP_Notifications";
const NOTIFICATION_ENDPOINT = "v2/Notification.svc";
const NOTIFICATION_TYPES_ENDPOINT = "v2/NotificationType.svc";

const logger = getLogger("notification-api");

export class NotificationService {
  static async getNotificationTypes(): Promise<NotificationType[]> {
    const notifServiceDest = await getCachedDestination(DESTINATION_NAME);

    try {
      const response = await executeHttpRequest(notifServiceDest, {
        url: `${NOTIFICATION_TYPES_ENDPOINT}/NotificationTypes`,
        method: "get"
      });
      return response.data.d.results as NotificationType[];
    } catch (error) {
      logger.error("Notification types could not be read");
      throw createError(error);
    }
  }

  static async createNotificationType(notificationType: NotificationType): Promise<NotificationType> {
    const notifServiceDest = await getCachedDestination(DESTINATION_NAME);

    try {
      const response = await executeHttpRequest(notifServiceDest, {
        url: `${NOTIFICATION_TYPES_ENDPOINT}/NotificationTypes`,
        method: "post",
        data: notificationType
      });
      return response.data.d as NotificationType;
    } catch (error) {
      logger.error(
        `Notification type ${notificationType.NotificationTypeKey}-${notificationType.NotificationTypeVersion} could not be created`
      );
      throw createError(error);
    }
  }

  static async deleteNotificationType(notifTypeId: string): Promise<HttpResponse> {
    const notifServiceDest = await getCachedDestination(DESTINATION_NAME);

    try {
      return executeHttpRequest(notifServiceDest, {
        url: `${NOTIFICATION_TYPES_ENDPOINT}/NotificationTypes(guid'${notifTypeId}')`,
        method: "delete"
      });
    } catch (error) {
      logger.error(`Notification type with id '${notifTypeId}' could not be deleted`);
      throw createError(error);
    }
  }

  static async createNotification(notification: srv.Notifications): Promise<srv.Notifications> {
    const notifServiceDest = await getCachedDestination(DESTINATION_NAME);

    try {
      const response = await executeHttpRequest(notifServiceDest, {
        url: `${NOTIFICATION_ENDPOINT}/Notifications`,
        method: "post",
        data: notification
      });
      this.logNotificationSuccess(notification);
      return response.data.d as srv.Notifications;
    } catch (error) {
      this.logNotificationError(notification);
      throw createError(error);
    }
  }

  private static logNotificationSuccess(notification: srv.Notifications) {
    logger.info(
      `Created notification '${notification.NotificationTypeKey}-${
        notification.NotificationTypeVersion
      }' for users ${JSON.stringify(notification.Recipients.map(r => r.RecipientId))}`
    );
  }

  private static logNotificationError(notification: srv.Notifications) {
    logger.error(
      `Notification '${notification.NotificationTypeKey}-${
        notification.NotificationTypeVersion
      }' for users ${JSON.stringify(notification.Recipients.map(r => r.RecipientId))} could not be created`
    );
  }
}
