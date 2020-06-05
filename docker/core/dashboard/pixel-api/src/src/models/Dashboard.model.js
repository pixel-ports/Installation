import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    title: {
      type: 'String'
    },
    description: {
      type: 'String'
    },
    definition: {
      type: 'Mixed'
    }
  },
  {
    timestamps: true
  }
);

mySchema.index({ '$**': 'text' });

export default model('Dashboard', mySchema);
