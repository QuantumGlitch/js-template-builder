const { Expression, Type: ExpressionType, GlobalRegex } = require('./index');

const { Variable } = require('../data/variable');
const { DataType } = require('../data/model-definition');

const Regex = {
  If: `@if\\s+(.*)`,
  Foreach: `@foreach\\s+${GlobalRegex.Identifier.Name}\\s+of\\s+${GlobalRegex.Identifier.Path}`,
};

class ControlExpression extends Expression {
  validateSyntax() {
    let match = null;

    // No value
    if (!this.value) return true;

    // Repeat
    // @foreach variable_x of variable_y.path....property
    if ((match = this.value.match(new RegExp(`^\\s*${Regex.Foreach}\\s*$`)))) {
      this.match = match;
      this.type = ExpressionType.Foreach;
    }
    // Condition
    // Continue code if variablePath's value is true
    // @if variable_x.path....property
    else if ((match = this.value.match(new RegExp(`^\\s*${Regex.If}\\s*$`)))) {
      this.match = match;
      this.type = ExpressionType.If;
    } else return false;

    return true;
  }

  validateSemantic({ context }) {
    this.description = null;

    switch (this.type) {
      //@foreach variable_x of variable_y.path....property
      case ExpressionType.Foreach:
        // upsearch in context variable path #(variable_y.path....property)
        this.iterator = this.validateVariablePath(this.match[2], context);

        if (this.iterator) {
          if (this.iterator.type !== DataType.Array) {
            this.error = `Can't use the instruction '@foreach' on '${this.match[2]}'. The type is not 'Array'.`;
            return;
          }
        } else return;

        this.description = `Repeat the block below for each element of '${this.iterator.description}', where the current element is '${this.match[1]}'.`;
        break;

      case ExpressionType.If:
        const valueExpression = new Expression({ value: this.match[1] });

        if (!valueExpression.validate({ context })) {
          this.error = `Can't validate the value << ${this.match[1]} >> ${
            valueExpression.error ? `<< ${valueExpression.error} >>` : ''
          }`;
          return false;
        }

        this.valueExpression = valueExpression;
        this.description = `Continue with the block below, if the variable or property '${this.match[1]}' is true or has a value.`;
        break;
    }

    return true;
  }

  /**
   * after validate checks, if there are new variables available returns them
   * @returns {Variable[]}
   */
  newVariables() {
    const variables = [];

    switch (this.type) {
      case ExpressionType.Foreach:
        // # @foreach
        const newVariable = new Variable({
          // # variable_x
          name: this.match[1],
          // # of variable_y.path....property
          // This is an element of an Array (If the Array has props then is an Object else a Primitive)
          type: this.iterator.props ? 'Object' : 'Primive',
          props: this.iterator.props,
          description: `Element of '${this.iterator.description}'`,
        });

        variables.push(newVariable);
        this.iteratorVariable = newVariable;
        break;
    }

    return variables;
  }

  /**
   * Render this control expression after validation and newVariables extraction
   * @param {Object} params
   * @param {Function} params.innerRender
   */
  render({ innerRender }) {
    switch (this.type) {
      case ExpressionType.Foreach:
        return this.iterator.value
          ? this.iterator.value.map((currentElement) => {
              /* 
            This variable is available in context, so bind it to the currentElement of the iterator
            so it will be available to sub contexts.
          */
              this.iteratorVariable.bind(currentElement);
              return innerRender();
            })
          : null;
      case ExpressionType.If:
        const value = this.valueExpression.evaluate();
        return value !== null && value !== undefined && value !== false ? innerRender() : null;
    }

    return innerRender();
  }
}

module.exports = { ControlExpression, Regex };
