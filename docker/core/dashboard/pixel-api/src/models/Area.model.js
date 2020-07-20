import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    idArea: {
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
    owner: {
      type: 'String'
    },
    terminal: {
      type: 'String'
    }
  },
  {
    timestamps: true
  }
);

mySchema.index({ '$**': 'text' });

export default model('Area', mySchema);
