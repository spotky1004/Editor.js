import ComponentBase from "../src/ComponentBase.js";
import ElementBuilder from "../src/ElementBuilder.js";
import updateProperty from "../src/updateProperty.js";

/**
 * @typedef {import("./index.js.js").AnyForm} AnyForm
 */
/**
 * @typedef ExtraOptions
 * @property {Object.<string, AnyForm>} forms
 */
/**
 * @typedef {Omit<import("../src/ComponentBase.js").ComponentBaseOptions, "name" | "defaultValue"> & ExtraOptions} Options
 */

const elementBuilder = new ElementBuilder(/** @type {const} */ ({
  type: "div",
  cacheAs: "wrapper",
  classNames: "component__form-bundle"
}));

/**
 * @template [T=Options]
 * @extends {ComponentBase<DefaultValue, T>}
 */
class Components extends ComponentBase {
  /**
   * @typedef {T["forms"]} Forms
   * @typedef {{ [K in keyof Forms]-? : Forms[K]["defaultValue"] }} DefaultValue 
   */
  /**
   * @param {T} options 
   */
  constructor(options) {
    /** @type {DefaultValue} */
    const defaultValue = {};
    for (const key in options.forms) {
      defaultValue[key] = options.forms[key].defaultValue;
    }
    options.defaultValue = defaultValue;
    super(options);
    const { element, cache } = elementBuilder.clone();
    /** @type {typeof element} */
    this.element = element;
    /** @type {typeof cache} */
    this.cache = cache;
    /** @type {Forms} */
    this.forms = this.rawOptions.forms;
    this.init();

    for (const key in this.forms) {
      this.element.appendChild(this.forms[key].element);
    }
  }

  set value(value) {
    this._value = value;
    this.render();
  }

  get value() {
    /** @type {DefaultValue} */
    const value = {};
    for (const key in this.forms) {
      value[key] = this.forms[key].value;
    }
    return value;
  }

  render() {
    for (const key in this.forms) {
      this.forms[key].render();
    }
  }

  clone() {
    /** @type {T} */
    const rawOptions = {...this.rawOptions};
    /** @type {Options["forms"]} */
    const forms = {...rawOptions.forms};
    for (const key in forms) {
      forms[key] = forms[key].clone();
    }
    rawOptions.forms = forms;
    return new Components(rawOptions);
  }
}

export default Components;
