sap.ui.define(
  ["sap/ui/base/Object", "sap/ui/core/Fragment", "sap/ui/model/json/JSONModel", "sap/m/MessageBox"],
  (BaseObject, Fragment, JSONModel, MessageBox) => {
    const FRAGMENT_ID = "notificationTestFragment";

    /**
     * Notification type tester. Can create notificiations for a notification type
     */
    return BaseObject.extend(
      "com.devepos.apps.cflp.notificationtypesadmin.ext.lib.NotificationTester",
      {
        constructor: function (controllerExtension, notifType) {
          this._ctrllerExt = controllerExtension;
          this._notifType = notifType;
        },

        async createNotification() {
          this._notificationTestDialog = await this._createDialog();

          this._ctrllerExt.getView().addDependent(this._notificationTestDialog);
          this._notificationTestDialog.open();
        },

        async onSubmit() {
          this._notificationTestDialog.setBusy(true);
          const notificationModel = this._ctrllerExt.getModel("notification");
          const actionBinding = notificationModel.bindContext("/createNotification(...)");
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
                error?.error?.message ||
                "Error during notification creation"
            );
          }
        },

        onCancel() {
          this._notificationTestDialog.close();
        },

        /**
         * Adds new line to table via model property update
         *
         * @param {object} event the event object
         */
        onAddTableLine(event) {
          const itemsPath = this._getTableItemsPath(event);
          if (!itemsPath) {
            return;
          }
          const itemsArray = this._dialogModel.getProperty(itemsPath);
          if (itemsArray) {
            itemsArray.push({});
            this._dialogModel.refresh();
          }
        },

        /**
         * Deletes selected rows from table model
         *
         * @param {object} event the event object
         */
        onDeleteTableLine(event) {
          const itemsPath = this._getTableItemsPath(event);
          if (!itemsPath) {
            return;
          }
          const items = this._dialogModel.getProperty(itemsPath);

          // Delete the selected items
          for (let i = items.length - 1; i >= 0; i--) {
            if (items[i].$selected) {
              items.splice(i);
            }
          }

          this._dialogModel.refresh();
        },

        async _createDialog() {
          this._dialogModel = new JSONModel({
            notification: this._getNotificationData(),
            Languages: await this._getLanguages()
          });

          const dialog = await Fragment.load({
            id: FRAGMENT_ID,
            name: "com.devepos.apps.cflp.notificationtypesadmin.ext.fragments.NewNotification",
            controller: this
          });

          dialog.attachAfterClose(() => {
            this._ctrllerExt.getView().removeDependent(dialog);
            dialog.destroy();
          });

          dialog.setModel(this._dialogModel);
          return dialog;
        },

        async _getLanguages() {
          const languageList = this._ctrllerExt.getModel().bindList("/Languages");
          const languageContexts = await languageList.requestContexts();
          return languageContexts.map(c => c.getObject());
        },

        _getTableItemsPath(event) {
          let control = event?.getSource();

          while (control && !control.isA("sap.m.Table")) {
            control = control.getParent();
          }

          const itemsBinding = control.getBinding("items");
          const context = itemsBinding.getContext();
          let itemsPath = "";
          if (context) {
            itemsPath = context.getPath();
          }
          itemsPath += `/${itemsBinding.getPath()}`;

          return itemsPath;
        },

        _removeComputedProperties(arrays) {
          arrays.forEach(array => {
            array.forEach(entry => {
              const computedProp = Object.keys(entry).filter(p => p.startsWith("$"));
              delete entry[computedProp];
            });
          });
        },

        _getNotificationData() {
          const data = {
            Priority: "Medium",
            Properties: [],
            TargetParameters: [],
            Recipients: []
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
    );
  }
);
