import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    idRule: {
      type: 'String'
    },
    // idPriority: {
    //   type: 'String'
    // },
    priority: [{ type: Schema.Types.Mixed }]
  },
  {
    timestamps: true
  }
);

mySchema.index({ '$**': 'text' });

export default model('Priority', mySchema);

// { cargoes_categories: [{ type: 'String' }] },
