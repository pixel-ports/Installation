import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    idSC: {
      type: 'String'
    },
    cargoes_category: [String],
    directions_Nature: [String],
    // directions_Nature: { type: 'String' },
    areas_ID: [String],
    shiftworks_ID: [String]
  },
  {
    timestamps: true
  }
);

mySchema.index({ '$**': 'text' });

export default model('Compatibility', mySchema);
