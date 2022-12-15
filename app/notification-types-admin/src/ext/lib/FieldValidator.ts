import Input from "sap/m/Input";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
// import Core from "sap/ui/core/Core";
import { ValueState } from "sap/ui/core/library";
import Model from "sap/ui/model/Model";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import SimpleType from "sap/ui/model/SimpleType";

type ModelProvider = {
  getModel(name?: string): Model;
};

/**
 * @namespace com.devepos.apps.cflp.notificationtypesadmin.ext.lib
 */
export default class FieldValidator {
  private modelProvider: ModelProvider;

  constructor(modelProvider: ModelProvider) {
    this.modelProvider = modelProvider;
  }

  registerFields(controls: Control[]) {
    // const messageManager = Core.getMessageManager();
    controls.forEach(c => {
      // messageManager.registerObject(c, true);

      const i18nModel = this.modelProvider.getModel("i18n") as ResourceModel;

      if (c instanceof Input && c.getRequired()) {
        c.attachChange((event: Event) => {
          const value = event.getParameter("value") as string;
          if (value) {
            c.setValueState(ValueState.None);
          } else {
            c.setValueState(ValueState.Error);
            c.setValueStateText(i18nModel.getProperty("MandatoryField_Empty"));
          }
        });
      }
    });
  }

  async validateControls(controls: Control[]): Promise<boolean> {
    let isValid = true;

    const i18nModel = this.modelProvider.getModel("i18n") as ResourceModel;

    for (const ctrl of controls) {
      if (ctrl instanceof Input) {
        const bindingType = (ctrl.getBinding("value") as PropertyBinding)?.getType() as SimpleType;

        if (bindingType) {
          try {
            await bindingType.validateValue(ctrl.getValue());
            ctrl.setValueState(ValueState.None);
          } catch (error) {
            ctrl.setValueState(ValueState.Error);
            isValid = false;
          }
        } else if (ctrl.getRequired() && ctrl.getValue() === "") {
          ctrl.setValueState(ValueState.Error);
          ctrl.setValueStateText(i18nModel.getProperty("MandatoryField_Empty"));
          isValid = false;
        } else {
          ctrl.setValueState(ValueState.None);
        }
      }
    }
    return isValid;
  }
}
