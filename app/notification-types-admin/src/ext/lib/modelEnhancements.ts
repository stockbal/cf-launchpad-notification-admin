export type Selectable = {
  $selected?: boolean;
} & Record<string, string>;

export interface TemplateableArray<T> extends Array<T> {
  getTemplate?(): object;
}

/**
 * Enhances arrays with additional properties for easier bindings
 * @param arrays list of array objects to be used in JSONModels for binding to tabular controls
 */
export function prepareArraysForTableBinding(arrays: TemplateableArray<Selectable>[]) {
  arrays.forEach(array => {
    array.push = function (...items: object[]): number {
      return Array.prototype.push.apply(
        array,
        items.map(i => ({ ...array.getTemplate?.(), ...i }))
      );
    };
    Object.defineProperty(array, "hasSelections", {
      get() {
        return !!array.find(p => p.$selected);
      }
    });
  });
}
