import ColumnListItem from "sap/m/ColumnListItem";
import Dialog from "sap/m/Dialog";
import MessageBox from "sap/m/MessageBox";
import Table from "sap/m/Table";
import Event from "sap/ui/base/Event";
import BaseObject from "sap/ui/base/Object";
import Control from "sap/ui/core/Control";
import Fragment from "sap/ui/core/Fragment";
import View from "sap/ui/core/mvc/View";
import JSONModel from "sap/ui/model/json/JSONModel";
import Model from "sap/ui/model/Model";
import Context from "sap/ui/model/odata/v4/Context";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import deepClone from "sap/base/util/deepClone";

import FieldValidator from "./FieldValidator";
import { prepareArraysForTableBinding, Selectable, TemplateableArray } from "./modelEnhancements";

type ControllerExtension = {
  getModel(name?: string): Model;
  getView(): View;
};

type NotificationType = {
  NotificationTypeKey: string;
  NotificationTypeVersion: string;
  TemplateLanguage: "" | "Mustache";
  Templates: {
    Language: {
      code: string;
    };
    TemplateSensitive: string;
    Subtitle: string;
  }[];
};

type Notification = {
  Priority: string;
  NotificationTypeKey: string;
  NotificationTypeVersion: string;
  Properties?: TemplateableArray<Selectable>;
  TargetParameters?: TemplateableArray<Selectable>;
  Recipients: TemplateableArray<Selectable>;
};

type DialogModelData = {
  notification: Notification;
  Languages: object[];
};

const FRAGMENT_ID = "notificationTestFragment";

/**
 * Notification type tester. Can create notificiations for a notification type
 * @namespace com.devepos.apps.cflp.notificationtypesadmin.ext.lib
 */
export default class NotificationTester extends BaseObject {
  private ctrllerExt: ControllerExtension;
  private notifType: Context;
  private notificationTestDialog: Dialog;
  private dialogModel: JSONModel;
  private validator: FieldValidator;
  private static languageList: ODataListBinding;

  constructor(controllerExtension: ControllerExtension, notifType: Context) {
    super();
    this.ctrllerExt = controllerExtension;
    this.notifType = notifType;
    this.validator = new FieldValidator(this.ctrllerExt);
  }

  async createNotification() {
    this.notificationTestDialog = await this.createDialog();
    this.registerHandlers();
    this.ctrllerExt.getView().addDependent(this.notificationTestDialog);
    this.notificationTestDialog.open();
  }

  async onSubmit() {
    if (
      !(
        (await this.validator.validateControls(
          this.notificationTestDialog.getControlsByFieldGroupId("actionInput")
        )) && this.isFormValid()
      )
    ) {
      return;
    }

    this.notificationTestDialog.setBusy(true);
    const notificationModel = this.ctrllerExt.getModel("notification") as ODataModel;
    const actionBinding = notificationModel.bindContext("/createNotification(...)");
    const notificationParam = deepClone(
      this.dialogModel.getProperty("/notification")
    ) as Notification;

    // payload needs to be cleaned up before it can be used
    this.removeComputedProperties([
      notificationParam.Properties,
      notificationParam.TargetParameters,
      notificationParam.Recipients
    ]);
    this.removeEmptyArrays(notificationParam);
    actionBinding.setParameter("notification", notificationParam);

    try {
      await actionBinding.execute();
      this.notificationTestDialog.close();
      this.notificationTestDialog = null;
    } catch (error) {
      this.notificationTestDialog.setBusy(false);
      MessageBox.error(
        typeof error === "string" ||
          (error as any)?.error?.message ||
          "Error during notification creation"
      );
    }
  }

  onCancel() {
    this.notificationTestDialog.close();
  }

  /**
   * Adds new line to table via model property update
   *
   * @param event the event object
   */
  onAddTableLine(event: Event) {
    const itemsPath = this.getTableItemsPath(event);
    if (!itemsPath) {
      return;
    }
    const itemsArray = this.dialogModel.getProperty(itemsPath) as TemplateableArray<any>;
    if (itemsArray) {
      itemsArray.push({});
      this.dialogModel.refresh();
    }
  }

  /**
   * Deletes selected rows from table model
   * @param event the event object
   */
  onDeleteTableLine(event: Event) {
    const itemsPath = this.getTableItemsPath(event);
    if (!itemsPath) {
      return;
    }
    const items = this.dialogModel.getProperty(itemsPath);

    // Delete the selected items
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].$selected) {
        items.splice(i, 1);
      }
    }

    this.dialogModel.refresh();
  }

  private async createDialog(): Promise<Dialog> {
    this.dialogModel = new JSONModel({
      notification: await this.getNotificationModelData(),
      Languages: await this.getLanguages()
    });

    const dialog = (await Fragment.load({
      id: FRAGMENT_ID,
      name: "com.devepos.apps.cflp.notificationtypesadmin.ext.fragments.NewNotification",
      controller: this
    })) as Dialog;

    dialog.attachAfterClose(() => {
      this.ctrllerExt.getView().removeDependent(dialog);
      dialog.destroy();
    });

    dialog.setModel(this.dialogModel);
    return dialog;
  }

  private registerHandlers() {
    this.validator.registerFields(
      this.notificationTestDialog.getControlsByFieldGroupId("actionInput")
    );

    // tables need to be handled separately as item controls are created
    // on the fly
    const possibleTables = this.notificationTestDialog.getControlsByFieldGroupId("editableTable");

    for (const table of possibleTables) {
      if (!(table instanceof Table)) {
        continue;
      }
      table.attachUpdateFinished(() => {
        const items = (table.getItems() as ColumnListItem[]) || [];
        for (const item of items) {
          if (!item.data("__handlerRegistered")) {
            this.validator.registerFields(
              item.getCells().filter(c => c.getFieldGroupIds().includes("actionInput"))
            );
            item.data("__handlerRegistered", true);
          }
        }
      });
    }
  }

  private async getLanguages(): Promise<object[]> {
    if (!NotificationTester.languageList) {
      NotificationTester.languageList = (this.ctrllerExt.getModel() as ODataModel).bindList(
        "/Languages"
      );
    }
    const languageContexts = await NotificationTester.languageList.requestContexts();
    return languageContexts.map(c => c.getObject() as object);
  }

  private isFormValid(): boolean {
    // check if model contains at least one recipient
    if ((this.dialogModel.getData() as DialogModelData).notification.Recipients.length === 0) {
      MessageBox.error(
        this.ctrllerExt
          .getModel("i18n")
          .getProperty("NotificationTester_Tables_Recipients_noDataProvided")
      );
      return false;
    }
    return true;
  }

  private getTableItemsPath(event: Event) {
    let control = event?.getSource() as Control;

    while (control && !control.isA("sap.m.Table")) {
      control = control.getParent() as Control;
    }

    const itemsBinding = control.getBinding("items");
    const context = itemsBinding.getContext();
    let itemsPath = "";
    if (context) {
      itemsPath = context.getPath();
    }
    itemsPath += `/${itemsBinding.getPath()}`;

    return itemsPath;
  }

  private removeComputedProperties(arrays: Record<string, unknown>[][]) {
    arrays.forEach?.(array => {
      array.forEach?.(entry => {
        Object.keys(entry)
          .filter(p => p.startsWith("$"))
          .forEach(propName => delete entry[propName]);
      });
    });
  }

  private async getNotificationModelData() {
    const expandedNotifType = await this.getExpandedNotificationType();

    const data = {
      Priority: "Medium",
      NotificationTypeKey: expandedNotifType.NotificationTypeKey,
      NotificationTypeVersion: expandedNotifType.NotificationTypeVersion,
      Properties: Object.assign([], {
        getTemplate: () => ({
          Language: sap.ui.getCore().getConfiguration().getLocale().getLanguage().toLowerCase()
        })
      }),
      TargetParameters: [],
      Recipients: []
    } as DialogModelData["notification"];

    prepareArraysForTableBinding([data.Properties, data.TargetParameters, data.Recipients]);

    // extract placeholder variables from template
    const placeholders = this.getTemplatePlacholders(expandedNotifType);

    for (const placeholder of placeholders) {
      data.Properties.push({ Key: placeholder });
    }

    return data;
  }

  private async getExpandedNotificationType(): Promise<NotificationType> {
    const expandedNotifTypeContext = this.ctrllerExt
      .getModel()
      .bindContext(this.notifType.getPath(), undefined, {
        $expand: "Templates",
        $select:
          "NotificationTypeKey,NotificationTypeVersion,TemplateLanguage,Templates/Language,Templates/TemplateSensitive,Templates/Subtitle"
      }) as ODataContextBinding;

    return (await expandedNotifTypeContext.requestObject()) as NotificationType;
  }

  private getTemplatePlacholders(expandedNotifType: NotificationType) {
    // determine template for current language
    const currentLanguage = sap.ui
      .getCore()
      .getConfiguration()
      .getLocale()
      .getLanguage()
      .toLowerCase();

    const template =
      expandedNotifType.Templates.find(t => t.Language.code === currentLanguage) ??
      (currentLanguage !== "en" && expandedNotifType.Templates.find(t => t.Language.code === "en"));

    if (!template) {
      return [];
    }

    const extractPlaceHolders = (text: string): string[] => {
      return [
        ...(expandedNotifType.TemplateLanguage === "Mustache"
          ? text.matchAll(/\{\{(\w+)\}\}/g)
          : text.matchAll(/\{(\w+)\}/g))
      ].map(matches => matches[1]);
    };

    return [
      ...new Set<string>([
        ...extractPlaceHolders(template.TemplateSensitive),
        ...extractPlaceHolders(template.Subtitle)
      ])
    ];
  }

  private removeEmptyArrays(notification: Notification) {
    if (!notification.Properties.length) {
      delete notification.Properties;
    }
    if (!notification.TargetParameters.length) {
      delete notification.TargetParameters;
    }
  }
}
