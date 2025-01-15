import { Activity } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDuration } from '@/lib/utils';
import Image from 'next/image';
import axios from 'axios';

interface ActivityListProps {
    activities: Activity[] | null;
}

function parseEmoji(activity: string) {
    let emojiName = activity
        .normalize('NFC')
        .replace(/ /gm, '')
        .replace(/\-/gm, '')
        .replace(/'/gm, '');
    if (emojiName == "TomClancy'sRainbowSixSiege")
        emojiName = 'RainbowSixSiege';
    return emojiName;
}

export default async function ActivityList({ activities }: ActivityListProps) {
    const emojis = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/emojis`
    );

    return (
        <Card className="bg-white dark:bg-[#111827] shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Recent Activities
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-gray-200 dark:border-gray-700">
                            <TableHead className="w-[150px] text-gray-700 dark:text-gray-300">
                                Name
                            </TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">
                                Duration
                            </TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">
                                Last Tracked
                            </TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">
                                Times Played
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activities ? (
                            activities.map((activity) => (
                                <TableRow
                                    key={activity.id + activity.name}
                                    className="border-gray-200 dark:border-gray-700"
                                >
                                    <TableCell className="font-medium text-gray-900 dark:text-white flex flex-row items-center">
                                        {emojis.data[
                                            parseEmoji(activity.name)
                                        ] && (
                                            <Image
                                                alt={activity.name}
                                                width={20}
                                                height={20}
                                                src={`https://cdn.discordapp.com/emojis/${
                                                    emojis.data[
                                                        parseEmoji(
                                                            activity.name
                                                        )
                                                    ]
                                                }.webp?size=240`}
                                                className="mr-1"
                                            />
                                        )}
                                        {activity.name}
                                    </TableCell>
                                    <TableCell className="text-gray-700 dark:text-gray-300">
                                        {formatDuration(activity.duration)}
                                    </TableCell>
                                    <TableCell className="text-gray-700 dark:text-gray-300">
                                        {new Date(
                                            activity.last_tracked
                                        ).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: '2-digit',
                                        })}
                                    </TableCell>
                                    <TableCell className="text-gray-700 dark:text-gray-300">
                                        {activity.timesPlayed || 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center text-gray-500 dark:text-gray-400"
                                >
                                    No activities found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
