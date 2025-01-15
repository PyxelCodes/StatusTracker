import { ApiResponse, GlobalStats as GlobalStatsType } from '@/types';
import { SignInButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import UserStats from './_components/UserStats';
import { Button } from '@/components/ui/button';
import axios from 'axios';

async function getData(userId: string | null): Promise<ApiResponse | null> {
    if (!userId) return null;
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/user/${userId}`
    );
    if (!res.data) {
        return null;
    }
    return res.data;
}

async function getGlobalStats(): Promise<GlobalStatsType> {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/global`);
    if (!res.data) {
        throw new Error('Failed to fetch global stats');
    }
    return res.data;
}

export default async function Home() {
    try {
        const user = await currentUser();

        if (!user) {
            return (
                <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-800 dark:to-indigo-900 animate-gradient">
                    <div className="bg-white dark:bg-[#111827] p-8 rounded-lg shadow-xl text-center max-w-2xl w-full">
                        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                            Welcome to StatusTracker
                        </h1>
                        <p className="mb-8 text-gray-600 dark:text-gray-300 text-lg">
                            Track your activities on Discord, and gain more data on your useage
                        </p>
                        <SignInButton>
                            <Button
                                size="lg"
                                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white font-semibold py-2 px-6 rounded-md transition duration-300"
                            >
                                Get Started
                            </Button>
                        </SignInButton>
                    </div>
                </main>
            );
        }

        try {
            const [data, globalStats] = await Promise.all([
                getData(user ? user.externalAccounts[0].externalId : null),
                getGlobalStats(),
            ]);

            return (
                <main className="min-h-screen p-8 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-800 dark:to-indigo-900 animate-gradient">
                    <div className="max-w-7xl mx-auto">
                        <UserStats
                            user={user}
                            data={data}
                            globalStats={globalStats}
                        />
                    </div>
                </main>
            );
        } catch (error) {
            console.error('Error fetching data:', error);

            return (
                <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-800 dark:to-indigo-900 animate-gradient">
                    <div className="bg-white dark:bg-[#111827] p-8 rounded-lg shadow-xl">
                        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                            Oops! Something went wrong
                        </h1>
                        <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
                            Failed to fetch remote data
                        </p>
                    </div>
                </main>
            );
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-800 dark:to-indigo-900 animate-gradient">
                <div className="bg-white dark:bg-[#111827] p-8 rounded-lg shadow-xl">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                        Oops! Something went wrong
                    </h1>
                    <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
                        Please try signing in again
                    </p>
                    <SignInButton mode="modal">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-md transition duration-300">
                            Sign In
                        </Button>
                    </SignInButton>
                </div>
            </main>
        );
    }
}
