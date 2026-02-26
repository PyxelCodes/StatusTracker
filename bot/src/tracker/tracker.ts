import signale from 'signale';
import { Shard } from 'aetherial';
import { TrackState } from './TrackState';
import User from '../schemas/User';
import Activity from '../schemas/Activity';
import { logger } from '../logger';

export async function track(client: Shard) {
    logger.scope('Tracker').info('Starting tracking cycle...');

    if ((client.wss as WebSocket).readyState === 0x3) {
        logger.scope('Tracker').warn('WS connection closed, aborting tracking.');
        return;
    }

    const bulkUserQueue = [];
    const bulkActivityQueue = [];
    const activityCache = new Map();
    const users = await User.find({ tracking: true });

    for (let presence of client.presences.values()) {
        if (users.find((u) => u._id === presence.user.id)) {
            try {
                let state = new TrackState( //@ts-ignore
                    presence,
                    activityCache,
                    bulkActivityQueue,
                    bulkUserQueue
                );
                await state.track();
            } catch (error) {
                logger.scope('Tracker').error(`Error tracking presence for user ${presence.user.id}:`, error);
            }
        }
    }

    if (bulkUserQueue.length) {
        logger.scope('Tracker').info(`Found ${bulkUserQueue.length} updates for st/Users`);
        let t = Date.now();
        await User.bulkWrite(bulkUserQueue);
        logger.scope('Tracker').info(`Completed bulk write in ${Date.now() - t}ms`);
    }

    if (bulkActivityQueue.length) {
        logger.scope('Tracker').info(`Found ${bulkActivityQueue.length} updates for st/Activities`);
        let t1 = Date.now();
        await Activity.bulkWrite(bulkActivityQueue);
        logger.scope('Tracker').info(`Completed bulk write in ${Date.now() - t1}ms`);
    }
}
