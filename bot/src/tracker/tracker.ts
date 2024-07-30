import { Shard } from 'aetherial';
import User from '../schemas/User';
import Activity from '../schemas/Activity';

export async function track(client: Shard) {
    console.log('Tracking...');

    for (let presence of client.presences.values()) {
        if (!presence.activities.length) continue; // skip if no activities

        // nested for loop bad
        for (let activity of presence.activities) {
            if (activity.type === 6) continue; // weird new "chilling" activity etc.
            let start_time = Date.now();

            await User.updateOne(
                { _id: presence.user.id },
                {},
                { upsert: true }
            );

            let act = await Activity.findOne({
                id: presence.user.id,
                name: activity.name,
            });

            if (!act) {
                let c = await Activity.create({
                    id: presence.user.id,
                    name: activity.name,
                    duration: Date.now() - activity.timestamps.start,
                    last_tracked: Date.now(),
                });
                await User.updateOne(
                    { _id: presence.user.id },
                    { $push: { activities: c._id } }
                );
            } else {
                let duration = Date.now() - activity.timestamps.start;
                if (activity.timestamps.start < act.last_tracked) {
                    duration = Date.now() - act.last_tracked;
                }

                await Activity.updateOne(
                    { id: presence.user.id, name: activity.name },
                    { $inc: { duration }, last_tracked: Date.now() }
                );
            }

            let trackstr = `User ${presence.user.id} is playing ${activity.name}`;
            trackstr += ` `.repeat(80 - trackstr.length);
            console.log(trackstr, `took ${Date.now() - start_time}ms`);
        }
    }
}