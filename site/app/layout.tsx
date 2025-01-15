import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Inter } from 'next/font/google';
import { shadesOfPurple } from '@clerk/themes';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Status Tracker | User Activity Dashboard',
    description: 'Status go brrrrr....',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <Script id="theme-script" strategy="beforeInteractive">
                    {`
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          `}
                </Script>
            </head>
            <body
                className={cn(
                    'min-h-screen bg-white dark:bg-gray-900 font-sans antialiased',
                    inter.className
                )}
            >
                <ClerkProvider
                    appearance={{
                        baseTheme: shadesOfPurple,
                        layout: {
                            unsafe_disableDevelopmentModeWarnings: true,
                        },
                    }}
                >
                    {children}
                    <ThemeToggle />
                </ClerkProvider>
            </body>
        </html>
    );
}
