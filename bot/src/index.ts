import { IntentBuilder, loadCommands, registerCommands, ShardingManager } from 'aetherial';
import config from '../config.json';
import signale from 'signale';
import path from 'path';

const sm = new ShardingManager(
    config.token,
    new IntentBuilder()
        .addIntent('GUILDS')
        .addIntent('GUILD_MESSAGES')
        .addIntent('GUILD_PRESENCES')
);

sm.config({ file: path.join(__dirname, 'shard.js') });

sm.spawn();



if (process.argv.includes('--push')) {
    let cmds = new Map<any,any>();
    signale.info('Registering commands...');
    loadCommands(cmds as any); // shenanigans
    registerCommands(cmds as any, config.token);
}