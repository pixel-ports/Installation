import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    idRule: {
      type: 'String'
    },
    idCargoCategory: {
      type: 'String'
    },
    segment: {
      type: 'String'
    },
    unit: {
      type: 'String'
    },
    typical_amount_range: [
      {
        type: 'Number'
      }
    ],
    assignation_preference: [
      {
        priority: { type: 'Number' },
        direction: { type: 'String' },
        dock_ID: { type: 'String' },
        supply_chain_ID: { type: 'String' }
      }
    ]
  },
  {
    timestamps: true
  }
);

mySchema.index({ '$**': 'text' });

export default model('CargoCategory', mySchema);
