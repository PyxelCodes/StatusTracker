'use client';

import { Moon, Sun, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DiscordLogoIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [touchStartTime, setTouchStartTime] = useState(0);

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        setIsDark(isDarkMode);
    }, []);

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        setIsDark(!isDark);
    };

    const handleTouchStart = () => {
        setTouchStartTime(Date.now());
    };

    const handleTouchEnd = () => {
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration > 500) {
            // Long press for like half a sec
            setIsExpanded(!isExpanded);
        }
    };
    /*
BRUHUHH IM PROBABLY OVERENGINEINRRRING THIS SHIT WHY IS THIS SO HARD TO GET TO LOOK GOOD WRTATFEIAHFPPESIGHJPIWESGHWPOUGVLBJWESHOUJLEWSRDHBF:ULJGJg
*/
    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    `group fixed bottom-6 left-6 flex items-center gap-3 rounded-full bg-white/30 backdrop-blur-sm dark:bg-black/30 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300`,
                    isExpanded ? 'w-64 sm:w-auto sm:px-6' : 'w-16',
                    `sm:hover:w-auto sm:hover:px-6`
                )}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
            >
                <Link
                    href={
                        'https://discord.com/oauth2/authorize?client_id=1255936103467323402&permissions=2147863552&integration_type=0&scope=bot'
                    }
                    className="flex items-center gap-3 text-blue-900 dark:text-blue-500"
                    target='_blank'
                >
                    <DiscordLogoIcon className="h-10 w-10 font-extrabold shrink-0" />
                    <span
                        className={cn(
                            `transition-all duration-300 whitespace-nowrap font-semibold overflow-hidden`,
                            isExpanded
                                ? 'max-w-[200px] opacity-100'
                                : 'max-w-0 opacity-0 sm:group-hover:max-w-[200px] sm:group-hover:opacity-100'
                        )}
                    >
                        Add StatusTracker to Discord
                    </span>
                    <ExternalLink
                        className={cn(
                            `h-5 w-5 transition-all duration-300 shrink-0`,
                            isExpanded
                                ? 'opacity-100 max-w-[20px]'
                                : 'opacity-0 max-w-0 sm:group-hover:opacity-100 sm:group-hover:max-w-[20px]'
                        )}
                    />
                </Link>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="fixed bottom-6 right-6 rounded-full w-16 h-16 bg-white/30 backdrop-blur-sm dark:bg-black/30 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
                onClick={toggleTheme}
            >
                {isDark ? (
                    <Sun className="h-8 w-8 text-yellow-500" />
                ) : (
                    <Moon className="h-8 w-8 text-slate-700" />
                )}
                <span className="sr-only">Toggle theme</span>
            </Button>
        </>
    );
}
