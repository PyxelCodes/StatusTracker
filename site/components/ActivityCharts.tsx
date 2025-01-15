'use client';

import { Activity } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

interface ActivityChartsProps {
    activities: Activity[] | null;
}

export default function ActivityCharts({ activities }: ActivityChartsProps) {
    if (!activities) {
        return (
            <Card className="bg-white dark:bg-[#111827] shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Activity Analytics
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center">
                    <p className="text-muted-foreground text-lg">
                        Sign in to view your activity analytics
                    </p>
                </CardContent>
            </Card>
        );
    }
    const colors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
    ];

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 12,
                    },
                    color: 'rgb(156, 163, 175)',
                    boxWidth: 15,
                    padding: 10,
                },
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
                        size: 11,
                    },
                    color: 'rgb(156, 163, 175)',
                    maxTicksLimit: 8,
                },
                grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                },
            },
            x: {
                ticks: {
                    font: {
                        size: 11,
                    },
                    color: 'rgb(156, 163, 175)',
                    maxRotation: 45,
                    minRotation: 45,
                },
                grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                },
            },
        },
    };

    const topActivities = activities.slice(0, 20); // Show only top 20 activities

    const barChartData = {
        labels: topActivities.map((a) => a.name),
        datasets: [
            {
                label: 'Duration (hours)',
                data: topActivities.map((a) => a.duration / (1000 * 60 * 60)),
                backgroundColor: colors,
                borderWidth: 2,
            },
        ],
    };

    const doughnutChartData = {
        labels: topActivities.map((a) => `${a.name} (hours)`),
        datasets: [
            {
                data: topActivities.map((a) => a.duration / (1000 * 60 * 60)),
                backgroundColor: colors,
                borderWidth: 2,
            },
        ],
    };

    const lineChartData = {
        labels: topActivities.map((a) => a.name),
        datasets: [
            {
                label: 'Times Played',
                data: topActivities.map((a) => a.timesPlayed || 0),
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
                borderWidth: 3,
            },
        ],
    };

    return (
        <Card className="bg-white dark:bg-[#111827] shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Activity Analytics
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="bar" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="bar">Duration</TabsTrigger>
                        <TabsTrigger value="doughnut">Distribution</TabsTrigger>
                        <TabsTrigger value="line">Engagement</TabsTrigger>
                    </TabsList>
                    <TabsContent value="bar">
                        <div className="h-[600px] w-full p-4">
                            <Bar options={chartOptions} data={barChartData} />
                        </div>
                    </TabsContent>
                    <TabsContent value="doughnut">
                        <div className="h-[600px] w-full p-4">
                            <Doughnut
                                options={chartOptions}
                                data={doughnutChartData}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="line">
                        <div className="h-[600px] w-full p-4">
                            <Line options={chartOptions} data={lineChartData} />
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
