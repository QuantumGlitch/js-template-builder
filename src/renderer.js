const XmlReader = require('xml-reader');

const { ModelDefinition } = require('./data/model-definition');
const { Expression } = require('./expression/');
const { ControlExpression } = require('./expression/control');
const { RootContext, Context } = require('./context');

/**
 * Helpers
 */

function hasClass(element, cls) {
  if (element.attributes && element.attributes.class)
    return element.attributes.class.split(' ').indexOf(cls) > -1;

  return false;
}

function formatExpressionError(expression) {
  return `\n\n![ Error: << ${expression.value.trim()} >> is not valid: ${
    expression.error || 'Generic Error.'
  } ]\n\n`;
}

function renderChildrenFromXmlNode(currentNode, lastContext) {
  return currentNode.children
    .map((child) => renderFromXmlNode(child, lastContext))
    .filter((r) => r !== undefined && r !== null)
    .join('');
}

function renderAttributesFromXmlNode(currentNode) {
  return currentNode.attributes && Object.keys(currentNode.attributes).length > 0
    ? ' ' +
        Object.keys(currentNode.attributes)
          .map((attr) => `${attr}="${currentNode.attributes[attr]}"`)
          .join('')
    : '';
}

function removeExtraSpaceAndNewLines(text) {
  return text.replace(/\r?\n|\r/g, '').replace(/\s+/g, ' ');
}

/**
 * @param {Object} currentNode
 * @param {Context} lastContext
 */
function renderFromXmlNode(currentNode, lastContext) {
  try {
    // If it is a data-context
    if (hasClass(currentNode, 'data-context')) {
      // Take data-control-expression
      const controlExpressionText = currentNode.children[0].children[0]
        ? currentNode.children[0].children[0].value
        : null;

      const controlExpression = controlExpressionText
        ? new ControlExpression({
            value: removeExtraSpaceAndNewLines(controlExpressionText),
          })
        : null;

      // Create current context
      const context = new Context({ parent: lastContext, controlExpression });
      const valid = context.validate();

      if (!valid) return formatExpressionError(context.controlExpression);

      // Render it
      const result = context.render({
        innerRender: () => renderFromXmlNode(currentNode.children[1], context),
      });

      return result === null || result === undefined
        ? ''
        : result instanceof Array
        ? result.join('')
        : result;
    }
    // If it is a data-declaration
    else if (hasClass(currentNode, 'data-declaration')) {
      // Create value expression
      const expression = new Expression({
        value: removeExtraSpaceAndNewLines(currentNode.children[0].value),
      });
      const valid = expression.validate({ context: lastContext });

      if (!valid) return formatExpressionError(expression);
    }
    // If it is an data-expression
    else if (hasClass(currentNode, 'data-expression')) {
      // Create expression
      const expression = new Expression({
        value: removeExtraSpaceAndNewLines(currentNode.children[0].value),
      });
      const valid = expression.validate({ context: lastContext });

      if (!valid) return formatExpressionError(expression);

      return expression.render();
    }
    // If it is a data-content just pass by
    else if (hasClass(currentNode, 'data-content'))
      return renderChildrenFromXmlNode(currentNode, lastContext);
    // Else cycle over child and continue the rendering
    else if (currentNode.type === 'element')
      return `<${currentNode.name}${renderAttributesFromXmlNode(
        currentNode
      )}>${renderChildrenFromXmlNode(currentNode, lastContext)}</${currentNode.name}>`;
    else if (currentNode.type === 'text') return currentNode.value;
  } catch (e) {
    console.error(e);
    return `Uncaught exception: ${e.message}`;
  }
}

/**
 * Given a ModelDefinition,
 *        the effective Model data (respecting the ModelDefinition) and
 *        the XML document coded in the expression language,
 * this function will return the rendered XML document
 *
 * @param {ModelDefinition} modelDefinition
 * @param {Object} model
 * @param {String} xml
 * @returns {Promise<String>}
 */
function parseFromXml(modelDefinition, model, xml) {
  return new Promise((resolve, reject) => {
    try {
      const reader = XmlReader.create();

      reader.on('done', (data) => {
        const rootContext = new RootContext({ modelDefinition });
        // Give a value to every prop in modelDefinition
        rootContext.bind(model);
        // Resolve with the rendered document
        resolve(renderFromXmlNode(data, rootContext));
      });

      reader.parse(xml);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = { parseFromXml };
