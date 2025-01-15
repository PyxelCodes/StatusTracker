import { User } from '@clerk/nextjs/server';
import { Activity, User as ApiUser } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignOutButton,
} from '@clerk/nextjs';
import { formatDuration } from '../lib/utils';

interface UserInfoCardProps {
    user: User | null;
    apiUser: ApiUser | null;
    activities: Activity[] | null;
}

export default function UserInfoCard({
    user,
    apiUser,
    activities,
}: UserInfoCardProps) {
    const totaltp = activities
        ? activities.reduce((acc, cur) => acc + cur.duration, 0)
        : 0;
    return (
        <Card className="bg-white dark:bg-[#111827] shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-x-4 pb-2">
                <div className="flex flex-row items-center space-x-4">
                    <Image
                        src={
                            user
                                ? user.externalAccounts[0].imageUrl
                                : 'https://cdn.discordapp.com/attachments/1241422268362653797/1326916099106799637/purple-color-palettes.png?ex=6781d32a&is=678081aa&hm=23e8c609c2a12275afdc25d87c64ce7d41d8a4f7c62851be1e0cd83c1cc3cacd&'
                        }
                        alt="Profile Image"
                        width={80}
                        height={80}
                        className="rounded-full border-4 border-purple-500"
                    />
                    <div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            Welcome,{' '}
                            {user
                                ? user.externalAccounts[0].firstName
                                : "You're not logged in"}
                            !
                        </CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Discord ID:{' '}
                            {user ? user.externalAccounts[0].externalId : '-'}
                        </p>
                    </div>
                </div>
                <SignedIn>
                    <SignOutButton />
                </SignedIn>
                <SignedOut>
                    <SignInButton mode={'modal'} />
                </SignedOut>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-purple-100 dark:bg-purple-900/50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                            Time played
                        </p>
                        <p className="text-lg text-purple-600 dark:text-purple-300">
                            {apiUser ? formatDuration(totaltp) : '-'}
                        </p>
                    </div>
                    <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-200">
                            Joined
                        </p>
                        <p className="text-lg text-indigo-600 dark:text-indigo-300">
                            {apiUser
                                ? new Date(apiUser.joined).toLocaleDateString()
                                : '-'}
                        </p>
                    </div>
                    <div className="bg-violet-100 dark:bg-violet-900/50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-violet-800 dark:text-violet-200">
                            Tracking
                        </p>
                        <p className="text-lg text-violet-600 dark:text-violet-300">
                            {apiUser
                                ? apiUser.tracking
                                    ? 'Active'
                                    : 'Inactive'
                                : '-'}
                        </p>
                    </div>
                    <div className="bg-fuchsia-100 dark:bg-fuchsia-900/50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-fuchsia-800 dark:text-fuchsia-200">
                            Activities
                        </p>
                        <p className="text-lg text-fuchsia-600 dark:text-fuchsia-300">
                            {activities ? activities.length : '-'}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
