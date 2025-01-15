import { model, Schema } from 'mongoose';

export default model(
    'Activity',
    new Schema({
        id: { type: String, required: true },
        name: { type: String, required: true },
        duration: { type: Number, required: true },
        last_tracked: { type: Number, required: true },
        last_sessionID: { type: String, required: false, default: "" },
        last_started: { type: Number, required: true },
        timesPlayed: { type: Number, required: true, default: 1 }
    })
);
