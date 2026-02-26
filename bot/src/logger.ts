import { Signale } from 'signale';

const options = {
  disabled: false,
  interactive: false,
  logLevel: 'info',
  config: {
    displayTimestamp: true,  // e.g., 15:04:32
    displayDate: true,       // e.g., 2026-02-26
    displayScope: true,      // e.g., [Database]
    displayBadge: true,      // Emojis! ℹ️, ✖️, ✔️
    displayFilename: true,   // e.g., [server.ts]
    displayLabel: true,      // e.g., INFO, ERROR
    uppercaseLabel: true,    // Makes labels stand out more
    underlineLabel: false,
    underlineMessage: false,
  },
};

export const logger = new Signale(options);