import { model, Schema } from 'mongoose';

export default model(
    'Activity',
    new Schema({
        id: { type: String, required: true },
        name: { type: String, required: true },
        duration: { type: Number, required: true },
        last_tracked: { type: Number, required: true },
    })
);