import { executeHttpRequest } from "@sap-cloud-sdk/http-client";

import { ExternalNotificationType } from "../../types";
import { createError } from "../error";
import { Destinations } from "../constants";
import { getCachedDestination } from "../destination";
import { getLogger } from "../log";

const NOTIFICATION_TYPES_ENDPOINT = "v2/NotificationType.svc";

const logger = getLogger("notification-api");

export class ExtNotificationTypeService {
  static async getNotificationTypes(): Promise<ExternalNotificationType[]> {
    const notifServiceDest = await getCachedDestination(Destinations.SAP_NOTIFICATION);

    try {
      const response = await executeHttpRequest(notifServiceDest, {
        url: `${NOTIFICATION_TYPES_ENDPOINT}/NotificationTypes`,
        method: "get"
      });
      return response.data.d.results as ExternalNotificationType[];
    } catch (error) {
      logger.error("Notification types could not be read");
      throw createError(error);
    }
  }

  static async deleteNotificationType(id: string): Promise<void> {
    const notifServiceDest = await getCachedDestination(Destinations.SAP_NOTIFICATION);

    try {
      await executeHttpRequest(notifServiceDest, {
        url: `${NOTIFICATION_TYPES_ENDPOINT}/NotificationTypes(guid'${id}')`,
        method: "delete"
      });
    } catch (error) {
      logger.error(`Notification type with Id '${id}' could not be deleted`);
      throw createError(error);
    }
  }

  static async createNotificationType(
    notificationType: ExternalNotificationType
  ): Promise<ExternalNotificationType> {
    const notifServiceDest = await getCachedDestination(Destinations.SAP_NOTIFICATION);

    try {
      const response = await executeHttpRequest(notifServiceDest, {
        url: `${NOTIFICATION_TYPES_ENDPOINT}/NotificationTypes`,
        method: "post",
        data: notificationType
      });
      return response.data.d as ExternalNotificationType;
    } catch (error) {
      logger.error(
        `Notification type ${notificationType.NotificationTypeKey}-${notificationType.NotificationTypeVersion} could not be created`
      );
      throw createError(error);
    }
  }
}
