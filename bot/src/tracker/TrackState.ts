import Activity from '../schemas/Activity';
import xfc_alias from '../utils/alias';

const incompatibleID = [3, 4, 6];

export class TrackState {
    presence: Presence;
    activityCache: Map<string, StoredActivity>;

    bulkActivityQueue: any[] = [];
    bulkUserQueue: any[] = [];

    constructor(
        presence: Presence,
        activityCache: Map<string, StoredActivity>,
        bulkActivityQueue: any[],
        bulkUserQueue: any[]
    ) {
        
        this.presence = presence;
        this.activityCache = activityCache;
        this.bulkActivityQueue = bulkActivityQueue;
        this.bulkUserQueue = bulkUserQueue;
    }

    public async track() {
        if (!this.presence.activities.length) return; // skip if no activities
        for (let activity of this.presence.activities) {
            try {
                if (!this.isCompatible(activity)) continue;
                await this.calculateActivity(activity);
            } catch (error) {
                console.log('ERROR -> Activity:', activity.name);
                console.log(error);
            }
        }
    }

    private async calculateActivity(activity: Activity) {
        let activityName = xfc_alias(activity.name);
        if (!this.validateTimestamp(activity)) return;
        let cacheKey = `${this.presence.user.id}-${activityName}`;
        let storedActivity = await this.cache(activity, cacheKey);
        let duration = this.getDuration(activity, storedActivity);

        if (storedActivity.new) {
            this.calculateNewState(
                storedActivity,
                activity.session_id,
                duration
            );
        } else {
            if (!storedActivity.last_sessionID)
                storedActivity.last_sessionID = activity.session_id;
            this.calculatePersistedState(
                activity.session_id,
                storedActivity.last_sessionID,
                duration,
                activityName,
                storedActivity.last_started,
                activity.timestamps.start
            );
        }
    }

    private isCompatible(activity: Activity): boolean {
        if (incompatibleID.includes(activity.type)) return false;
        if (activity.id === 'ec0b28a579ecb4bd') return false; // bot status
        if (
            (activity as any).application_id === '307998818547531777' &&
            !activity?.timestamps?.start
        )
            return false; // Medal.tv
        return true;
    }

    private validateTimestamp(activity: Activity) {
        if (!activity.timestamps?.start) {
            console.log('WARN -> No start time for activity:');
            console.log(
                activity.name,
                ' -> ',
                (activity as any).application_id
            );
            return;
        }
        return true;
    }

    private async cache(activity: Activity, cacheKey): Promise<StoredActivity> {
        let act = this.activityCache.get(cacheKey);

        if (!act) {
            act = await Activity.findOne({
                id: this.presence.user.id,
                name: xfc_alias(activity.name),
            });
            if (!act) {
                act = {
                    id: this.presence.user.id,
                    name: xfc_alias(activity.name),
                    duration: 0,
                    last_tracked: 0,
                    last_started: activity.timestamps.start,
                    timesPlayed: 1,
                    last_sessionID: activity.session_id,
                    new: true, // Flag to indicate new activity
                };
            }
        }

        this.activityCache.set(cacheKey, act);
        return act;
    }

    private getDuration(activity: Activity, act: StoredActivity): number {
        let duration = Date.now() - activity.timestamps.start;
        if (activity.timestamps.start < act.last_tracked) {
            duration = Date.now() - act.last_tracked;
        }
        return duration;
    }

    private calculateNewState(
        act: StoredActivity,
        sessionID: string,
        duration: number
    ) {
        this.bulkActivityQueue.push({
            insertOne: {
                document: {
                    id: this.presence.user.id,
                    name: act.name,
                    duration,
                    last_tracked: Date.now(),
                    last_sessionID: sessionID,
                    last_started: Date.now(),
                    timesPlayed: 1,
                },
            },
        });

        this.bulkUserQueue.push({
            updateOne: {
                filter: { _id: this.presence.user.id },
                update: { $push: { activities: act._id } },
                upsert: true,
            },
        });
    }

    private calculatePersistedState(
        sessionID: string,
        last_sessionID: string,
        duration: number,
        activityName: string,
        last_started_stored: number,
        last_started: number
    ) {
        let upstream = {
            $inc: { duration } as UpstreamInc,
            $set: { last_tracked: Date.now() } as UpstreamSet,
        };

        // same session
        if (last_sessionID !== sessionID) {
            upstream.$inc.timesPlayed = 1;
        } else if(last_started_stored !== last_started) {
            upstream.$inc.timesPlayed = 1;
        }

        upstream.$set.last_sessionID = sessionID;
        upstream.$set.last_started = last_started;

        this.bulkActivityQueue.push({
            updateOne: {
                filter: { id: this.presence.user.id, name: activityName },
                update: upstream,
            },
        });
    }
}

interface Presence {
    user: {
        id: string;
    };
    status: string;
    activities: Activity[];
}

interface Activity {
    type: number;
    timestamps: {
        start: number;
    };
    state: string;
    session_id: string;
    name: string;
    id: string;
    flags: number;
    details: string;
    created_at: number;
    buttons: string[];
    assets: {
        [asset_id: string]: string;
    };
    application_id: string;
}

interface StoredActivity {
    id: string;
    _id?: string; // Mongoose ID
    name: string;
    duration: number;
    last_tracked: number;
    last_sessionID: string;
    last_started: number;
    timesPlayed: number;
    new?: boolean;
}

interface UpstreamInc {
    duration: number;
    timesPlayed?: number;
}

interface UpstreamSet {
    last_tracked: number;
    last_sessionID?: string;
    last_started?: number;
}
