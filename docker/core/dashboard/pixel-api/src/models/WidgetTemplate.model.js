import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    source: {
      type: 'String'
    },
    template: { type: 'Mixed' },
    type: { type: 'String' }
  },
  {
    timestamps: true
  }
);

export default model('WidgetTemplate', mySchema);
