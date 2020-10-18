const { Renderer, ModelDefinition, DataType } = require('./src/index');

Renderer.parseFromXml(
  ModelDefinition.parseFromRawObject({
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
  {
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
  },
  /*html*/ `
  <any>
    <any class="data-declaration">sellings = Array.filterByProperty(reportData.sellings, "quantity", ">", 0)</any>            
    <any class="data-declaration">firstSelling = sellings.0</any>
    <h1>
      <any class="data-expression">firstSelling.id</any>
    </h1>
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
              </any>

              Quantity:
              <any class="data-expression">
                selling.quantity
              </any>

              Price:
              <any class="data-expression">
                selling.product.price
              </any>

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
  </any>`
).then(console.log);
