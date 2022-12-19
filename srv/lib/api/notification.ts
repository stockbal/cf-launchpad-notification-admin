import { executeHttpRequest } from "@sap-cloud-sdk/http-client";

import { NotificationServiceTypes as srv } from "../../types";
import { createError } from "../error";
import { Destinations } from "../constants";
import { getCachedDestination } from "../destination";
import { getLogger, LoggerId } from "../log";

const NOTIFICATION_ENDPOINT = "v2/Notification.svc";

const logger = getLogger(LoggerId.ExtNotificationAPI);

export class ExtNotificationService {
  /**
   * Creates notification in Launchpad
   * @param notification notification payload
   * @returns result of POST
   */
  static async createNotification(notification: srv.Notification): Promise<string> {
    const notifServiceDest = await getCachedDestination(Destinations.SAP_NOTIFICATION);

    try {
      const response = await executeHttpRequest(notifServiceDest, {
        url: `${NOTIFICATION_ENDPOINT}/Notifications`,
        method: "post",
        data: notification
      });
      ExtNotificationService.logNotificationSuccess(notification);
      return response.data.d.Id as string;
    } catch (error) {
      ExtNotificationService.logNotificationError(notification);
      throw createError(error);
    }
  }

  private static logNotificationSuccess(notification: srv.Notification) {
    logger.info(
      `Created notification '${notification.NotificationTypeKey}-${
        notification.NotificationTypeVersion
      }' for users ${JSON.stringify(
        (notification.Recipients as { RecipientId: string }[]).map(r => r.RecipientId)
      )}`
    );
  }

  private static logNotificationError(notification: srv.Notification) {
    let errorText = `Notification '${notification.NotificationTypeKey}-${notification.NotificationTypeVersion}'`;
    if (notification.Recipients?.length > 0) {
      errorText = `${errorText} for users ${JSON.stringify(
        (notification.Recipients as { RecipientId: string }[]).map(r => r.RecipientId)
      )} could not be created`;
    }
    logger.error(errorText);
  }
}
