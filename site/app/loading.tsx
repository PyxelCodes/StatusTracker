import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-800 dark:to-indigo-900 animate-gradient text-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <p className="mt-4 text-xl font-semibold text-white">
                    Loading...
                </p>
        </div>
    );
}
