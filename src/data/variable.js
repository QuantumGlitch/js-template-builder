const { ModelNodeDefinition, Type } = require('./model-definition');

class Variable extends ModelNodeDefinition {
  /**
   * @param {Object} constructorParams
   * @param {String} constructorParams.name Name of the variable
   * @param {String} [constructorParams.description] Description for the variable
   * @param {Type} constructorParams.type Type
   * @param {ModelNodeDefinition[]} [constructorParams.props] (These are specified only for Object and Array. For the Object are properties for the Array are the children's properties). N.B: If Type = 'Array' and there are no props then is a Array of Primitive.
   */
  constructor({ name, description = null, type = null, props = null } = {}) {
    super({ name, description, type, props });
  }
}

module.exports = { Variable };
