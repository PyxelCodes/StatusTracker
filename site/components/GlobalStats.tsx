'use client';

import { GlobalActivity } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface GlobalStatsProps {
    activities: GlobalActivity[];
}

export default function GlobalStats({ activities }: GlobalStatsProps) {
    // Get top 15 activities for better visualization
    const topActivities = activities
        .sort((a, b) => b.total_duration - a.total_duration)
        .slice(0, 15);

    const colors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(201, 203, 207, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(201, 203, 207, 0.8)',
        'rgba(255, 99, 132, 0.8)',
    ];

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    font: {
                        size: 14,
                    },
                    color: 'rgb(156, 163, 175)',
                },
            },
            title: {
                display: true,
                text: 'Top 15 Most Popular Activities',
                font: {
                    size: 16,
                },
                color: 'rgb(156, 163, 175)',
            },
            tooltip: {
                titleFont: {
                    size: 12,
                },
                bodyFont: {
                    size: 11,
                },
                boxPadding: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'rgb(229, 231, 235)',
                bodyColor: 'rgb(229, 231, 235)',
            },
        },
        scales: {
            y: {
                ticks: {
                    font: {
                        size: 12,
                    },
                    color: 'rgb(156, 163, 175)',
                },
                grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                },
            },
            x: {
                ticks: {
                    font: {
                        size: 12,
                    },
                    color: 'rgb(156, 163, 175)',
                },
                grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                },
            },
        },
    };

    const chartData = {
        labels: topActivities.map((a) => a._id),
        datasets: [
            {
                label: 'Total Hours',
                data: topActivities.map(
                    (a) => a.total_duration / (1000 * 60 * 60)
                ),
                backgroundColor: colors,
                borderWidth: 2,
            },
        ],
    };

    return (
        <Card className="bg-white dark:bg-[#111827] shadow-xl mt-8">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Global Activity Statistics
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="bar" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                        <TabsTrigger value="doughnut">Distribution</TabsTrigger>
                    </TabsList>
                    <TabsContent value="bar">
                        <div className="h-[600px] w-full p-4">
                            <Bar options={chartOptions} data={chartData} />
                        </div>
                    </TabsContent>
                    <TabsContent value="doughnut">
                        <div className="h-[600px] w-full p-4">
                            <Doughnut options={chartOptions} data={chartData} />
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}