import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    idMachine: {
      type: 'String'
    },
    idResource: {
      type: 'String'
    },
    label: {
      type: 'String'
    },
    type: {
      type: 'String'
    },
    group: {
      type: 'String'
    },
    owner: {
      type: 'String'
    },
    shiftID: {
      type: 'String'
    },
    throughput: {
      value: { type: 'Number' },
      unit: { type: 'String' }
    },
    consumptions: [
      {
        nature: { type: 'String' },
        value: { type: 'Number' },
        unit: { type: 'String' }
      }
    ]
  },
  {
    timestamps: true
  }
);

mySchema.index({ '$**': 'text' });

export default model('Machine', mySchema);
