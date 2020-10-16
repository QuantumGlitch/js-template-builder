/**
 * @readonly
 * @enum {String}
 *
 * We have only three types atm
 */
const DataType = {
  Object: 'Object',
  Array: 'Array',
  Primitive: 'Primitive',
};

/**
 * @class
 * Generic representation of an object's property in js
 */
class ModelNodeDefinition {
  /**
   * @param {Object} constructorParams
   * @param {String} constructorParams.name Name of the property
   * @param {String} [constructorParams.description] Description for the property
   * @param {Type} constructorParams.type Type
   * @param {ModelNodeDefinition[]} [constructorParams.props] (These are specified only for Object and Array. For the Object are properties for the Array are the children's properties). N.B: If Type = 'Array' and there are no props then is a Array of Primitive.
   */
  constructor({ name, description = null, type, props = null }) {
    this.name = name;
    this.description = description;
    this._type = type;
    this._props = props;

    /**
     * This will be available after model bind
     */
    this.value = undefined;
  }

  // Bind the model's value to this node and its sub nodes
  bind(v) {
    this.value = v;

    // Sub bind
    if (this.type === 'Object' && typeof v === 'object' && v)
      this.props.forEach((p) => p.bind(v[p.name]));
  }

  static parseFromRawObject(obj) {
    const modelNode = new ModelNodeDefinition({
      name: obj.name,
      description: obj.description,
      type: obj.type,
    });

    if (obj.props)
      modelNode.props = obj.props.map((p) => ModelNodeDefinition.parseFromRawObject(p));

    return modelNode;
  }

  //#region Getter and Setter
  get type() {
    return this._type;
  }

  set type(v) {
    this._type = v;
  }

  get props() {
    return this._props;
  }

  set props(v) {
    this._props = v;
  }
  //#endregion

  /**
   * Follow the path moving through properties
   * @param {String[]} path
   * @returns {ModelNodeDefinition}
   */
  getByPath(path) {
    let node = this;

    for (let i = 0; i < path.length; i++) {
      node = node.props.find((v) => v.name === path[i]);
      if (!node) break;
    }

    return node;
  }

  static getByPath(node, path) {
    for (let i = 0; i < path.length; i++) {
      node = node.props.find((v) => v.name === path[i]);
      if (!node) break;
    }

    return node;
  }
}

/**
 * @class
 * This is used for specify the structure of the model that will be compiled.
 * This is the root for all nested ModelNodeDefinition
 */
class ModelDefinition extends ModelNodeDefinition {
  /**
   * @param {Object} constructorParams
   * @param {Type} constructorParams.type Type
   * @param {ModelNodeDefinition[]} [constructorParams.props] (These are specified only for Object and Array. For the Object are properties for the Array are the children's properties). N.B: If Type = 'Array' and there are no props then is a Array of Primitive.
   */
  constructor({ type, props }) {
    super({ type, props });
  }

  static parseFromRawObject(obj) {
    const modelDefinition = new ModelDefinition({ type: obj.type });
    if (obj.props)
      modelDefinition.props = obj.props.map((p) => ModelNodeDefinition.parseFromRawObject(p));
    return modelDefinition;
  }
}

module.exports = { ModelNodeDefinition, ModelDefinition, DataType };
