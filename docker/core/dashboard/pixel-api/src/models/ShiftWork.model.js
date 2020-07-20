import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    idRule: {
      type: 'String'
    },
    idShiftWork: {
      type: 'String'
    },
    value: [Schema.Types.Mixed]
  },
  {
    timestamps: true
  }
);

mySchema.index({ '$**': 'text' });

export default model('ShiftWork', mySchema);
