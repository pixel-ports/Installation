import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    title: {
      type: 'String'
    },
    description: {
      type: 'String'
    },
    source: {
      type: 'String'
    },
    type: {
      type: 'String'
    },
    definition: {
      type: 'Mixed'
    },
    filter: {
      type: 'Mixed'
    },
    home: {
      type: 'Mixed'
    }
  },
  {
    timestamps: true
  }
);

mySchema.index({ '$**': 'text' });

export default model('Widget', mySchema);
