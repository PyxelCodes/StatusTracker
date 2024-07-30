import { model, ObjectId, Schema, SchemaTypes } from 'mongoose';

export default model(
    'User',
    new Schema({
        _id: { type: String, required: true },
        username: { type: String, required: false },
        activities: {
            type: Array,
        },
        joined: { type: Number, required: true, default: Date.now() },
    })
);
