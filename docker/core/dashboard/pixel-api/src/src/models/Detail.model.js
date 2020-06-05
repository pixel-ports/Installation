import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    idSC: {
      type: 'String'
    },
    idDetail: {
      type: 'String'
    },
    label: {
      type: 'String'
    },
    comment: {
      type: 'String'
    }
  },
  {
    timestamps: true
  }
);

mySchema.index({ '$**': 'text' });

export default model('Detail', mySchema);
