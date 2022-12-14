import Dialog from "sap/m/Dialog";
import MessageBox from "sap/m/MessageBox";
import Event from "sap/ui/base/Event";
import BaseObject from "sap/ui/base/Object";
import Control from "sap/ui/core/Control";
import Fragment from "sap/ui/core/Fragment";
import View from "sap/ui/core/mvc/View";
import JSONModel from "sap/ui/model/json/JSONModel";
import Model from "sap/ui/model/Model";
import Context from "sap/ui/model/odata/v4/Context";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";

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
  private _ctrllerExt: ControllerExtension;
  private _notifType: Context;
  private _notificationTestDialog: Dialog;
  private _dialogModel: any;

  constructor(controllerExtension: ControllerExtension, notifType: Context) {
    super();
    this._ctrllerExt = controllerExtension;
    this._notifType = notifType;
  }

  async createNotification() {
    this._notificationTestDialog = await this._createDialog();

    this._ctrllerExt.getView().addDependent(this._notificationTestDialog);
    this._notificationTestDialog.open();
  }

  async onSubmit() {
    this._notificationTestDialog.setBusy(true);
    const notificationModel = this._ctrllerExt.getModel(
      "notification"
    ) as ODataModel;
    const actionBinding = notificationModel.bindContext(
      "/createNotification(...)"
    );
    const actionParam = this._dialogModel.getProperty("/notification");

    // payload needs to be cleaned up before it can be used
    this._removeComputedProperties([
      actionParam.Properties,
      actionParam.TargetParameters,
      actionParam.Recipients
    ]);
    actionBinding.setParameter("notification", actionParam);
    try {
      await actionBinding.execute();
      this._notificationTestDialog.close();
      this._notificationTestDialog = null;
    } catch (error) {
      this._notificationTestDialog.setBusy(false);
      MessageBox.error(
        typeof error === "string" ||
          (error as any)?.error?.message ||
          "Error during notification creation"
      );
    }
  }

  onCancel() {
    this._notificationTestDialog.close();
  }

  /**
   * Adds new line to table via model property update
   *
   * @param {object} event the event object
   */
  onAddTableLine(event: Event) {
    const itemsPath = this._getTableItemsPath(event);
    if (!itemsPath) {
      return;
    }
    const itemsArray = this._dialogModel.getProperty(itemsPath);
    if (itemsArray) {
      itemsArray.push({});
      this._dialogModel.refresh();
    }
  }

  /**
   * Deletes selected rows from table model
   *
   * @param {object} event the event object
   */
  onDeleteTableLine(event: Event) {
    const itemsPath = this._getTableItemsPath(event);
    if (!itemsPath) {
      return;
    }
    const items = this._dialogModel.getProperty(itemsPath);

    // Delete the selected items
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].$selected) {
        items.splice(i, 1);
      }
    }

    this._dialogModel.refresh();
  }

  private async _createDialog(): Promise<Dialog> {
    this._dialogModel = new JSONModel({
      notification: this._getNotificationData(),
      Languages: await this._getLanguages()
    });

    const dialog = (await Fragment.load({
      id: FRAGMENT_ID,
      name: "com.devepos.apps.cflp.notificationtypesadmin.ext.fragments.NewNotification",
      controller: this
    })) as Dialog;

    dialog.attachAfterClose(() => {
      this._ctrllerExt.getView().removeDependent(dialog);
      dialog.destroy();
    });

    dialog.setModel(this._dialogModel);
    return dialog;
  }

  private async _getLanguages() {
    const languageList = (this._ctrllerExt.getModel() as ODataModel).bindList(
      "/Languages"
    );
    const languageContexts = await languageList.requestContexts();
    return languageContexts.map(c => c.getObject());
  }

  private _getTableItemsPath(event: Event) {
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

  private _removeComputedProperties(arrays: Record<string, unknown>[][]) {
    arrays.forEach(array => {
      array.forEach(entry => {
        Object.keys(entry)
          .filter(p => p.startsWith("$"))
          .forEach(propName => delete entry[propName]);
      });
    });
  }

  private _getNotificationData() {
    const data = {
      Priority: "Medium",
      Properties: [] as Selectable[],
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
