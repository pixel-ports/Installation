import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    source: {
      type: 'String'
    },
    template: { type: 'Mixed' },
    type: { type: 'String' },
    yaml: { type: 'String' }
  },
  {
    timestamps: true
  }
);

export default model('alerttemplate', mySchema);
