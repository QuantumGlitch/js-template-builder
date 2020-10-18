const { DataType, ModelNodeDefinition } = require('../data/model-definition');
const { Variable } = require('../data/variable');
const { Context } = require('../context');

/**
 * @param {DataType} obj
 */
function deduceDataType(obj) {
  if (obj === DataType.Primitive) return { type: DataType.Primitive };
  else return obj;
}

// Expression's Global Functions
const Functions = {
  // Return function by name
  get(name) {
    return this[name].function || this.name;
  },
  add(name, def) {
    this[name] = def;
  },
  // For debugging or specific purposes
  evalJS: function (string) {
    return eval(string);
  },
  // Get the value of a property path of an object
  getProperty(obj, propertyPath) {
    const path = propertyPath.split('.');
    let value = obj;

    for (let prop of path)
      if (value && value.hasOwnProperty(prop)) value = value[prop];
      else return null;

    return value;
  },
  // Truthy functions
  '>': {
    function(a, b) {
      return a > b;
    },
    returns: { type: DataType.Primitive, description: 'Result of a comparation' },
  },
  '<': {
    function(a, b) {
      return a > b;
    },
    returns: { type: DataType.Primitive, description: 'Result of a comparation' },
  },
  '<=': {
    function(a, b) {
      return a <= b;
    },
    returns: { type: DataType.Primitive, description: 'Result of a comparation' },
  },
  '>=': {
    function(a, b) {
      return a >= b;
    },
    returns: { type: DataType.Primitive, description: 'Result of a comparation' },
  },
  '==': {
    function(a, b) {
      return a == b;
    },
    returns: { type: DataType.Primitive, description: 'Result of a equality' },
  },
  '===': {
    function(a, b) {
      return a === b;
    },
    returns: { type: DataType.Primitive, description: 'Result of a strict equality' },
  },
  '!=': {
    function(a, b) {
      return a == b;
    },
    returns: { type: DataType.Primitive, description: 'Result of a disequality' },
  },
  '!==': {
    function(a, b) {
      return a == b;
    },
    returns: { type: DataType.Primitive, description: 'Result of a strict disequality' },
  },
  // Arithmetic functions
  sum: {
    function(...params) {
      return params.reduce((pV, cV) => pV + cV, 0);
    },
    returns: { type: DataType.Primitive, description: 'Result of a sum' },
  },
  sub: {
    function(first, ...params) {
      return params.reduce((pV, cV) => pV - cV, first);
    },
    returns: { type: DataType.Primitive, description: 'Result of a subtraction' },
  },
  mul: {
    function(...params) {
      return params.reduce((pV, cV) => pV * cV, 1);
    },
    returns: { type: DataType.Primitive, description: 'Result of a multiplication' },
  },
  div: {
    function(first, ...params) {
      return params.reduce((pV, cV) => pV / cV, first);
    },
    returns: { type: DataType.Primitive, description: 'Result of a division' },
  },
  // Array arithmetics functions
  'Array.sum': {
    function(array, property) {
      if(!array) return null;
      if (property) return Functions.sum.function(...array.map((e) => e[property]));
      return Functions.sum.function(...array);
    },
    returns: { type: DataType.Primitive, description: 'Result of a sum' },
  },
  'Array.sub': {
    function(array, property) {
      if(!array) return null;
      if (property) return Functions.subtract.function(...array.map((e) => e[property]));
      return Functions.subtract.function(...array);
    },
    returns: { type: DataType.Primitive, description: 'Result of a subtraction' },
  },
  'Array.mul': {
    function(array, property) {
      if(!array) return null;
      if (property) return Functions.multiply.function(...array.map((e) => e[property]));
      return Functions.multiply.function(...array);
    },
    returns: { type: DataType.Primitive, description: 'Result of a multiplication' },
  },
  'Array.div': {
    function(array, property) {
      if(!array) return null;
      if (property) return Functions.divide.function(...array.map((e) => e[property]));
      return Functions.divide.function(...array);
    },
    returns: { type: DataType.Primitive, description: 'Result of a division' },
  },
  'Array.weightedSum': {
    function(...arrays) {
      for(const arr of arrays)
        if(!arr) return null;

      let sum = 0;
      for (let i = 0; i < arrays[0].length; i++) {
        // Multiply all i-th element of arrays
        const product = arrays.reduce((pV, cV) => pV * cV[i], 1);
        sum += product;
      }
      return sum;
    },
    returns: { type: DataType.Primitive, description: 'Result of a weighted sum' },
  },
  // Map an array
  'Array.mapByProperty': {
    function(array, property) {
      return array ? array.map((e) => Functions.getProperty(e, property)) : null;
    },
    returns: ([arrayType], [_, propertyValue]) => ({
      type: DataType.Array,
      props: ModelNodeDefinition.getByPath(arrayType.props, propertyValue),
      description: `Mapped array << ${arrayType.description} >> by property ${propertyValue}`,
    }),
  },
  'Array.filterByProperty': {
    function(array, property, func, ...params) {
      const myFunc = Functions.get(func);
      if (!myFunc) throw new Error(`Can't find the function called '${func}'`);
      if(!array) return null;
      return array.filter((e) => myFunc(Functions.getProperty(e, property), ...params));
    },
    returns: ([arrayType], [_, propertyValue], [__, functionName]) => ({
      type: DataType.Array,
      props: arrayType.props,
      description: `Filtered array << ${arrayType.description} >> by property '${propertyValue}' with function '${functionName}'`,
    }),
  },
};

/**
 * Expression Types
 * @enum {String}
 */
const Type = {
  // Expressions that returns a variable path's value
  VariableValue: 'VariableValue',
  // Expression that returns a static value
  StaticValue: 'StaticValue',
  // Expression that returns a function's call value
  FunctionCallValue: 'FunctionCallValue',
  // Expression that create a new variable
  Declaration: 'Declaration',
  // Flow Control
  If: 'If',
  Foreach: 'Foreach',
};

const GlobalRegex = {
  Static: {
    String: `"([^"\\\\]*(?:\\\\[\\s\\S][^"\\\\]*)*)"`,
    Number: `(\\d+(\\.\\d+){0,1})`,
  },
  Identifier: {
    Name: '([$A-Za-z_][0-9A-Za-z_$]*)',
    Path: '(([$A-Za-z_][0-9A-Za-z_$]*)(\\.[$A-Za-z_][0-9A-Za-z_$]*)*)',
  },
  Function: {
    Identifier: '[0-9A-Za-z\\_\\>\\<\\^\\|?\\!\\&\\$\\-\\+\\=\\.]+',
  },
};

GlobalRegex.Function.Call = `(${GlobalRegex.Function.Identifier})\\s*\\((.*)\\)`;
GlobalRegex.Declaration = `${GlobalRegex.Identifier.Name}\\s*=\\s*(.*)`;

// This class is an expression, will be evaluated at compile-time
class Expression {
  /**
   * @param {Object} constructorParams
   * @param {String} constructorParams.value
   */
  constructor({ value } = {}) {
    this.value = value;

    /**
     * @type {String}
     */
    this.error = null;

    /**
     * @type {String}
     */
    this.description = null;
  }

  /**
   * @param {String} varPath
   * @param {Context} context
   */
  validateVariablePath(varPath, context) {
    const variable = context.searchVar(varPath) || context.upsearchVar(varPath);
    if (!variable) this.error = `Can't find the variable or property '${varPath}'.`;
    return variable;
  }

  /**
   * Check if this expression's syntax is valid
   * @returns {Boolean}
   */
  validateSyntax() {
    let match = null;

    // This expression can be validated without semantic
    // "...string value..."
    if ((match = this.value.match(new RegExp(`^\\s*${GlobalRegex.Static.String}\\s*$`)))) {
      this.match = match;
      this.type = Type.StaticValue;
      // Replace escaped quotes with quotes
      this.staticValue = match[1].replace('\\"', '"');
    }
    // This expression can be validated without semantic
    // e.g. 120, 0.9, 0.0024
    else if ((match = this.value.match(new RegExp(`^\\s*${GlobalRegex.Static.Number}\\s*$`)))) {
      this.match = match;
      this.type = Type.StaticValue;
      // Replace escaped quotes with quotes
      this.staticValue = Number(this.match[1]);
    }
    // The simplest value expression, a variable's path
    // variable_x.property....finalProp
    else if ((match = this.value.match(new RegExp(`^\\s*${GlobalRegex.Identifier.Path}\\s*$`)))) {
      this.match = match;
      this.type = Type.VariableValue;
    }
    // Function call
    // functionName(param1, param2, args...)
    else if ((match = this.value.match(new RegExp(`^\\s*${GlobalRegex.Function.Call}\\s*$`)))) {
      this.match = match;
      this.type = Type.FunctionCallValue;
    }
    // Declaration
    // variableName = anotherVariable
    // variableName = anotherVariable.property
    // variableName = functionName(param1, param2, args...)
    else if ((match = this.value.match(new RegExp(`^\\s*${GlobalRegex.Declaration}\\s*$`)))) {
      this.match = match;
      this.type = Type.Declaration;
    } else return false;

    return true;
  }

  /** Check if this expression's semantic is valid in the given context
   * @returns {Boolean}
   */
  validateSemantic({ context }) {
    switch (this.type) {
      case Type.VariableValue:
        const variable = this.validateVariablePath(this.match[1], context);
        if (!variable) return false;
        this.variable = variable;
        break;

      case Type.FunctionCallValue:
        const functionName = this.match[1];
        if (Functions[functionName]) {
          // Function's name is valid
          const functionParameters = [];

          let parenthesis = 0;
          let currentParam = '';
          for (let i = 0; i < this.match[2].length; i++) {
            const char = this.match[2][i];

            if (char === '(') parenthesis++;
            else if (char === ')') parenthesis--;

            if (parenthesis === 0) {
              if (char === ',') {
                functionParameters.push(currentParam);
                currentParam = '';
                continue;
              }
            }

            currentParam += this.match[2][i];
          }
          functionParameters.push(currentParam);

          const parameters = [];

          // Check if parameters are valid
          for (let p = 0; p < functionParameters.length; p++) {
            const paramExpression = new Expression({ value: functionParameters[p] });
            const valid = paramExpression.validate({ context });

            if (!valid) {
              this.error = `Can't validate the parameter << ${functionParameters[p]} >>  ${
                paramExpression.error ? `<< ${paramExpression.error} >>` : ''
              }`;
              return false;
            }

            parameters.push(paramExpression);
          }

          this.functionName = functionName;
          this.parameters = parameters;
        } else {
          this.error = `Can't find the function '${functionName}'`;
          return false;
        }
        break;

      case Type.Declaration:
        const valueExpression = new Expression({ value: this.match[2] });

        if (!valueExpression.validate({ context })) {
          this.error = `Can't validate the value << ${this.match[2]} >> ${
            valueExpression.error ? `<< ${valueExpression.error} >>` : ''
          }`;
          return false;
        }

        // Deduce type of this declaration
        const dataType = valueExpression.deduceDataType();

        const declaredVariable = new Variable({
          name: this.match[1],
          type: dataType.type,
          props: dataType.props,
          description: dataType.description,
        });

        declaredVariable.value = valueExpression.evaluate();

        context.variables.push(declaredVariable);

        break;
    }

    return true;
  }

  /**
   * Validate in the context
   * @param {Context} context
   * @returns {Boolean}
   */
  validate({ context }) {
    return this.validateSyntax() && this.validateSemantic({ context });
  }

  deduceDataType() {
    if (this.type === Type.FunctionCallValue) {
      let dataType = Functions[this.functionName].returns;

      if (typeof dataType === 'function')
        // If returns type is a function, then deduce the return type by the parameters types
        return Functions[this.functionName].returns(
          ...this.parameters.map((p) => [p.deduceDataType(), p.evaluate()])
        );

      return deduceDataType(dataType);
    } else if (this.type === Type.VariableValue) return this.variable;
    else return { type: DataType.Primitive };
  }

  /**
   * Get the value to which the expression is evaluated
   */
  evaluate() {
    switch (this.type) {
      case Type.StaticValue:
        return this.staticValue;
      case Type.VariableValue:
        return this.variable.value;
      case Type.FunctionCallValue:
        return (Functions[this.functionName].function || Functions[this.functionName])(
          ...this.parameters.map((param) => param.evaluate())
        );
    }

    return undefined;
  }

  /**
   * Render the value of the expression after validation
   */
  render() {
    return this.evaluate();
  }
}

module.exports = { Expression, Type, GlobalRegex, Functions };
