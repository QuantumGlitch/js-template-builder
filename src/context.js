const { ModelDefinition, ModelNodeDefinition } = require('./data/model-definition');
const { Variable } = require('./data/variable');
const { ControlExpression } = require('./expression/control');

class Context {
  /**
   * @param {Object} constructorParams
   * @param {Context} constructorParams.parent Parent context in which this context will be evaluated
   * @param {ControlExpression} constructorParams.controlExpression This control expression will be evaluated before resolving subContexts
   */
  constructor({ parent, controlExpression } = {}) {
    this.children = [];
    this.parent = parent;
    this.controlExpression = controlExpression;
    this.variables = [];
  }

  //#region Getters and setters
  get parent() {
    return this._parent;
  }

  /**
   * @param {Context|null} p
   */
  set parent(p) {
    if (this.parent === p) return;

    // Remove as child from the previous parent
    if (this.parent) this.parent.children = this.parent.children.filter((c) => c !== this);

    // No parent, is now in the root
    if (p) {
      // Add as child to the new parent
      p.children.push(this);
      this._parent = p;
    }
  }
  //#endregion

  /**
   * Add a context as child to the current one
   * @param {Context} childContext
   */
  addChild(childContext) {
    childContext.parent = this;
  }

  /**
   * Check if control expression is valid and extract new variables
   * @returns {Boolean}
   */
  validate() {
    this.variables = [];

    // No control expression, then is always valid
    if (!this.controlExpression) return true;

    // Check if the flow instructions are valid
    if (this.controlExpression.validate({ context: this })) {
      // Extract new variables that will be available in this context and subContexts
      this.variables = [...this.variables, ...this.controlExpression.newVariables()];
      return true;
    }

    return false;
  }

  /**
   * Render the context after validation.
   * A context wraps sub code (represented by innerRender), so we need to apply the control expression on it.
   * @param {Object} params
   * @param {Function} params.innerRender
   */
  render({ innerRender }) {
    if (this.controlExpression) return this.controlExpression.render({ innerRender });
    else return innerRender();
  }

  /**
   * Watch parent by parent if exists the specified variable path and returns it
   * @param {String} varPath
   * @returns {Variable|ModelNodeDefinition}
   */
  upsearchVar(varPath) {
    let path = varPath.split('.');
    const name = path.shift();

    let parentContext = this.parent;
    let variable = null;

    // Move through parents to find the same variable root name
    while (parentContext && !variable) {
      variable = parentContext.searchVarByName(name);
      parentContext = parentContext.parent;
    }

    // Get prop if needed
    return variable ? variable.getByPath(path) : null;
  }

  /**
   * Search var path in this.variables
   * @param {String} varPath
   * @returns {Variable|ModelNodeDefinition}
   */
  searchVar(varPath) {
    let path = varPath.split('.');
    const name = path.shift();

    const variable = this.variables.find((v) => v.name === name);

    // Get prop if needed
    return variable ? variable.getByPath(path) : null;
  }

  /**
   * Search var name in this.variables
   * @param {String} varName
   * @returns {Variable|ModelNodeDefinition}
   */
  searchVarByName(name) {
    return this.variables.find((v) => v.name === name);
  }
}

/**
 * This is the root (global) context
 * The only purpouse of this root context is making available
 * the modelDefinition and the derived interactions
 */
class RootContext extends Context {
  /**
   * @param {Object} constructorParams
   * @param {ModelDefinition} constructorParams.modelDefinition Root model definition ( this is the global scope )
   */
  constructor({ modelDefinition }) {
    super({});
    this.variables = modelDefinition.props;
  }

  //#region Getters and Setters
  get parent() {
    return null;
  }

  set parent(_) {}
  //#endregion

  bind(model) {
    this.variables.forEach((v) => v.bind(model[v.name]));
  }

  // There is no context up to this
  upsearchVar() {
    return null;
  }
}

module.exports = { RootContext, Context };
