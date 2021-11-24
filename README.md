# Package: js-template-builder

Provide a set of tools to build a report with a customizable reporting language. Similar to Excel or Microsoft SQL Report Builder.
Provided a XML/HTML Template and a Model Definition (The structure of the input data) and the Model (the input data), the package outputs a compiled XML/HTML file.

# Purpose

This is meant to be used as a support for the end user who wants to modify the reports or views generated through the package. For example this is useful with CKEditor that provide an HTML Editor (see also [ckeditor5-template-builder](https://github.com/QuantumGlitch/ckeditor5-template-builder#readme)).

# Install

```shell
npm i js-template-builder
```

# Usage

Let's see a pratical example :

```js
const { Renderer, ModelDefinition, DataType } = require('report-builder');

// This is the model definition or structure
const modelDefinition = ModelDefinition.parseFromRawObject({
    type: DataType.Object,
    props: [
      {
        name: 'reportData',
        type: DataType.Object,
        props: [
          {
            name: 'sellings',
            type: DataType.Array,
            props: [
              {
                name: 'id',
                type: DataType.Primitive,
              },
              {
                name: 'product',
                type: DataType.Object,
                props: [
                  {
                    name: 'id',
                    type: DataType.Primitive,
                  },
                  {
                    name: 'price',
                    type: DataType.Primitive,
                  },
                ],
              },
              {
                name: 'quantity',
                type: DataType.Primitive,
              },
            ],
          },
        ],
      },
    ],
  }),

// The data itself
const model = {
    reportData: {
      sellings: [
        {
          id: 0,
          quantity: 0,
          product: {
            id: 1,
            price: 20.5,
          },
        },
        {
          id: 1,
          quantity: 2,
          product: {
            id: 2,
            price: 50,
          },
        },
        {
          id: 2,
          quantity: 11,
          product: {
            id: 4,
            price: 5,
          },
        },
      ],
    },
  };

const template = /*html*/`
  <any>
    <any class="data-declaration">sellings = Array.filterByProperty(reportData.sellings, "quantity", ">", 0)</any>
    <any class="data-context">
      <any class="data-control-expression">
          @foreach selling of sellings
      </any>
      <any class="data-content">
        <any class="data-context">
          <any class="data-control-expression">
          </any>
          <any class="data-content">
            <any>
              Id:
              <any class="data-expression">
                selling.id
              </any>,

              Quantity:
              <any class="data-expression">
                selling.quantity
              </any>,

              Price:
              <any class="data-expression">
                selling.product.price
              </any>,

              Total:
              <any class="data-expression">
                mul(selling.product.price, selling.quantity)
              </any>
            </any>
          </any>
        </any>
      </any>
    </any>
    <any>
      Report resum:
      <any>
        Total Quantity:
        <any class="data-expression">Array.sum(Array.mapByProperty(sellings, "quantity"))</any>
      </any>
      <any>
        Total Income:
        <any class="data-expression">Array.weightedSum(Array.mapByProperty(sellings, "quantity"), Array.mapByProperty(sellings, "product.price"))</any>
      </any>
    </any>
  </any>`;

// Execute
Renderer.parseFromXml(modelDefinition, model, html).then((result) => console.log(result));
```

The output will be the following

```html
// Will print the following
<any>
  <any> Id: 1, Quantity: 2, Price: 50, Total: 100 </any>
  <any> Id: 2, Quantity: 11, Price: 5, Total: 55 </any>
  <any>
    Report resum:
    <any> Total Quantity: 13 </any>
    <any> Total Income: 155 </any>
  </any>
</any>
```

# Model Definition

There are three different kind of nodes for model definition: Primitive, Object, Array.
Every model node definition has different properties:

| Property Type | Purpose                                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name          | the name of the property                                                                                                                                                  |
| type          | value between Primitive, Object, Array                                                                                                                                    |
| props         | defined only if type is Object or Array. Every prop is a model node definition. In the case of an Array if this property is not defined then it is an Array of Primitives |

# Language for templating

## Expressions

The language defined for reporting is based on Expressions of two types: Expression and Control Expression.

The first one is used for returning a value while the second one to alter the flow control of the rendering.

### Expression

This returns a value.
This is achieved throught the attribute class **data-expression**:

In the example before :

```html
<any class="data-expression example-class"
  >Array.weightedSum(Array.mapByProperty(sellings, "quantity"), Array.mapByProperty(sellings,
  "product.price"))</any
>
```

You can apply the class on any element and the result will be the following once executed:

```html
<any class="example-class">Executed value converted to string</any>
```

The format of the expression inside can be :

1. **a function call with parameters**. << functionName(param1.prop.x, param2, "staticValue", 0.2) >> or << functionName(functionName2(...), ...) >>. There are some functions included by default inside the package ( watch the next sections ).
2. **a variable property path** << variableName >> or << variableName.property >> or << variableName.property.a >>
3. **a static value** (string or number) << "string" >> or << 55 >> or << 0.2333 >>

There is an additional expression type of this class, that is used for declaring variables:
In the example before ( was used for filtering the reportData.sellings array by the property quantity greater than 0 ) :

```html
<any class="data-declaration">
  sellings = Array.filterByProperty(reportData.sellings, "quantity", ">", 0)
</any>
```

It won't render anything.
Add the variable sellings in the **current context** and will be **accessible** to **sub contexts**.

### Control Expression

This is control the flow of execution, one maximum for context is allowed:

```html
<any>
  <any class="data-context">
    <any class="data-control-expression"> ... The expression goes here ... </any>
    <any class="data-content"> ... The content we want to control ... </any>
  </any>
</any>
```

At the moment two types of control expressions are allowed:

| Type        | Usage                                              | Purpose                                                                                                                                    |
| ----------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **If**      | **@if variablePropertyPath**                       | Conditionally render the data-content block. If variablePropertyPath is true (this mean if it is not null, undefined or false), renders it |
| **Foreach** |  **@foreach element of variablePropertyPathArray** | Repeat the data-content block for each element of the array and add the variable 'element' to be accessible to sub contexts                |

## Functions

The following are the built-in functions :

### Comparation

| Name | Description                                                                                | Usage    |
| ---- | ------------------------------------------------------------------------------------------ | -------- |
| >    | Compare two numbers. Returns true if first argument is greater than second one             | >(a,b)   |
| <    | Compare two numbers. Returns true if first argument is smaller than second one             | <(a,b)   |
| <=   | Compare two numbers. Returns true if first argument is greater or equals to the second one | >=(a,b)  |
| >=   | Compare two numbers. Returns true if first argument is smaller or equals to the second one | <=(a,b)  |
| ==   | Compare two primitives. Returns true if they are equal                                     | ==(a,b)  |
| ===  | Compare two primitives. Returns true if they are strict equal                              | ===(a,b) |
| !=   | Compare two primitives. Returns true if they are not equal                                 | !=(a,b)  |
| !==  | Compare two primitives. Returns true if they are not strict equal                          | !==(a,b) |

### Arithmetic

| Name | Description                                       | Usage             |
| ---- | ------------------------------------------------- | ----------------- |
| sum  | Returns the sum of the numeric parameters         | sum(a,b,c,d,....) |
| sub  | Returns the subtraction of the numeric parameters | sum(a,b,c,d,....) |
| mul  | Returns the product of the numeric parameters     | mul(a,b,c,d,....) |
| div  | Returns the division of the numeric parameters    | div(a,b,c,d,....) |

### Array

| Name                   | Description                                                                                            | Usage                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Array.sum              | Sum the elements of an array                                                                           | Array.sum(array)                                                                             |
| Array.sub              | Sub the elements of an array                                                                           | Array.sub(array)                                                                             |
| Array.mul              | Multiply the elements of an array                                                                      | Array.mul(array)                                                                             |
| Array.div              | Divide the elements of an array                                                                        | Array.div(array)                                                                             |
| Array.weightedSum      | Execute weighted sum of arrays                                                                         | Array.weightedSum(array1,array2,...)                                                         |
| Array.mapByProperty    | From an array of objects, returns an array of its own element properties.                              | Array.mapByProperty(array, "property")                                                       |
| Array.filterByProperty | Filter an array by its own element properties. Compare the property of the element through a function. | Array.filterByProperty(array, "property", functionName, functionParam2, functionParam3, ...) |

### Custom

You can add a custom function through the following API:

```js
const { Functions, DataType } = require('report-builder');

// Function that returns primitives
Functions.add('operation', {
  function: (param1, param2, param3) => (param1 * param2) % param3,
  returns: DataType.Primitive,
});

// Function that returns complexs
// Ex: Merge two objects
Functions.add('merge', {
  function: (param1, param2) => {
    const obj = {};
    for (const prop in param1) obj[prop] = param1[prop];
    for (const prop in param2) obj[prop] = param2[prop];
    return obj;
  },
  returns: ([dataTypeParam1, valueParam1], [dataTypeParam2, valueParam2]) => {
    return {
      type: DataType.Object,
      props: [...dataTypeParam1.props, ...dataTypeParam2.props],
    };
  },
});
```

# Support

If you would like to support my work, [please buy me a coffe ☕](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=HRVBJMSU9CQXW).
Thanks in advice.
