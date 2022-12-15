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
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import FieldValidator from "./FieldValidator";

type ControllerExtension = {
  getModel(name?: string): Model;
  getView(): View;
};

type Selectable = {
  $selected?: boolean;
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
      !(await this.validator.validateControls(
        this.notificationTestDialog.getControlsByFieldGroupId("actionInput")
      ))
    ) {
      return;
    }
    this.notificationTestDialog.setBusy(true);
    const notificationModel = this.ctrllerExt.getModel(
      "notification"
    ) as ODataModel;
    const actionBinding = notificationModel.bindContext(
      "/createNotification(...)"
    );
    const actionParam = this.dialogModel.getProperty("/notification");

    // payload needs to be cleaned up before it can be used
    this.removeComputedProperties([
      actionParam.Properties,
      actionParam.TargetParameters,
      actionParam.Recipients
    ]);
    actionBinding.setParameter("notification", actionParam);
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
    const itemsArray = this.dialogModel.getProperty(itemsPath);
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
      notification: this.getNotificationData(),
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
    const possibleTables =
      this.notificationTestDialog.getControlsByFieldGroupId("editableTable");

    for (const table of possibleTables) {
      if (!(table instanceof Table)) {
        continue;
      }
      table.attachUpdateFinished(() => {
        const items = (table.getItems() as ColumnListItem[]) || [];
        for (const item of items) {
          if (!item.data("__handlerRegistered")) {
            this.validator.registerFields(
              item
                .getCells()
                .filter(c => c.getFieldGroupIds().includes("actionInput"))
            );
            item.data("__handlerRegistered", true);
          }
        }
      });
    }
  }

  private async getLanguages(): Promise<object[]> {
    if (!NotificationTester.languageList) {
      NotificationTester.languageList = (
        this.ctrllerExt.getModel() as ODataModel
      ).bindList("/Languages");
    }
    const languageContexts =
      await NotificationTester.languageList.requestContexts();
    return languageContexts.map(c => c.getObject() as object);
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
    arrays.forEach(array => {
      array.forEach(entry => {
        Object.keys(entry)
          .filter(p => p.startsWith("$"))
          .forEach(propName => delete entry[propName]);
      });
    });
  }

  private getNotificationData() {
    const data = {
      Priority: "Medium",
      Properties: [{}] as Selectable[],
      TargetParameters: [] as Selectable[],
      Recipients: [] as Selectable[]
    };

    [data.Properties, data.TargetParameters, data.Recipients].forEach(array => {
      Object.defineProperty(array, "hasSelections", {
        get() {
          return !!array.find(p => p.$selected);
        }
      });
    });
    return data;
  }
}
