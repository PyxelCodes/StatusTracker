import signale from 'signale';
import { Shard } from 'aetherial';
import { TrackState } from './TrackState';
import User from '../schemas/User';
import Activity from '../schemas/Activity';

export async function track(client: Shard) {
    console.log('Tracking...');

    if ((client.wss as WebSocket).readyState === 0x3) {
        console.log('WS connection closed, aborting tracking.');
        return;
    }

    const bulkUserQueue = [];
    const bulkActivityQueue = [];
    const activityCache = new Map();
    const users = await User.find({ tracking: true });

    for (let presence of client.presences.values()) {
        if (users.find((u) => u._id === presence.user.id)) {
            console.log(`--> Tracking ${presence.user.id}`);
            try {
                let state = new TrackState( //@ts-ignore
                    presence,
                    activityCache,
                    bulkActivityQueue,
                    bulkUserQueue
                );
                await state.track();
            } catch (error) {
                console.log('ERROR -> Presence:', presence.user.id);
                console.log(error);
            }
        }
        console.log(`Skipping ${presence.user.id}`);
    }
    console.log(JSON.stringify(bulkActivityQueue, null, 2));

    if (bulkUserQueue.length) {
        signale.info(
            `[BulkWrite] Found ${bulkUserQueue.length} updates for st/Users`
        );
        let t = Date.now();
        await User.bulkWrite(bulkUserQueue);
        signale.info(`[BulkWrite] Completed in ${Date.now() - t}ms`);
    }

    if (bulkActivityQueue.length) {
        signale.info(
            `[BulkWrite] Found ${bulkActivityQueue.length} updates for st/Activities`
        );
        let t1 = Date.now();
        await Activity.bulkWrite(bulkActivityQueue);
        signale.info(`[BulkWrite] Completed in ${Date.now() - t1}ms`);
    }
}
