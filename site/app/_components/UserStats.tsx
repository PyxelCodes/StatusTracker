import ActivityCharts from '@/components/ActivityCharts';
import ActivityList from '@/components/ActivityList';
import UserInfoCard from '@/components/UserInfoCard';
import GlobalStats from '@/components/GlobalStats';
import { ApiResponse, GlobalStats as GlobalStatsType } from '@/types';
import { User } from '@clerk/nextjs/server';

interface UserStatsProps {
    user: User | null;
    data: ApiResponse | null;
    globalStats: GlobalStatsType;
}

export default function UserStats({ user, data, globalStats }: UserStatsProps) {
    return (
        <>
            <UserInfoCard
                user={user}
                apiUser={data ? data.user : null}
                activities={data ? data.activities : null}
            />
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ActivityList
                    activities={data ? data.activities : null}
                />
                <ActivityCharts
                    activities={data ? data.activities : null}
                />
            </div>
            <GlobalStats activities={globalStats.activities} />
        </>
    );
}

