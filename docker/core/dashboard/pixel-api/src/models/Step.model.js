import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    idSC: {
      type: 'String'
    },
    idStep: {
      type: 'String'
    },
    label: {
      type: 'String'
    },
    comment: {
      type: 'String'
    },
    category: {
      type: 'String'
    },
    scheduling: {
      start: {
        nature: { type: 'String' },
        value: { type: Schema.Types.Mixed }
      },
      duration: {
        nature: { type: 'String' },
        value: { type: Schema.Types.Mixed }
      }
    },
    work: {
      nature: { type: 'String' },
      distance: { type: 'String' },
      machines: [
        {
          type: 'String'
        }
      ]
    }
  },
  {
    timestamps: true
  }
);

mySchema.index({ '$**': 'text' });

export default model('Step', mySchema);
