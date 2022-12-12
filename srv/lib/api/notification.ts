import { executeHttpRequest, HttpResponse } from "@sap-cloud-sdk/http-client";

import { NotificationServiceTypes as srv, ExternalNotificationType } from "../../types";
import { createError } from "../axios";
import { Destinations } from "../constants";
import { getCachedDestination } from "../destination";
import { getLogger } from "../log";

const NOTIFICATION_ENDPOINT = "v2/Notification.svc";

const logger = getLogger("notification-api");

export class ExtNotificationService {
  /**
   * Creates notification in Launchpad
   * @param notification notification payload
   * @returns result of POST
   */
  static async createNotification(notification: srv.Notifications): Promise<srv.Notifications> {
    const notifServiceDest = await getCachedDestination(Destinations.SAP_NOTIFICATION);

    try {
      const response = await executeHttpRequest(notifServiceDest, {
        url: `${NOTIFICATION_ENDPOINT}/Notifications`,
        method: "post",
        data: notification
      });
      ExtNotificationService.logNotificationSuccess(notification);
      return response.data.d as srv.Notifications;
    } catch (error) {
      ExtNotificationService.logNotificationError(notification);
      throw createError(error);
    }
  }

  private static logNotificationSuccess(notification: srv.Notifications) {
    logger.info(
      `Created notification '${notification.NotificationTypeKey}-${
        notification.NotificationTypeVersion
      }' for users ${JSON.stringify(notification.Recipients.map((r) => r.RecipientId))}`
    );
  }

  private static logNotificationError(notification: srv.Notifications) {
    logger.error(
      `Notification '${notification.NotificationTypeKey}-${
        notification.NotificationTypeVersion
      }' for users ${JSON.stringify(
        notification.Recipients.map((r) => r.RecipientId)
      )} could not be created`
    );
  }
}
