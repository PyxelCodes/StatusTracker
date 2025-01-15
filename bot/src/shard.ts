import './instrument';
import { loadCommands, Shard } from './aetherial/src';
import config from '../config.json';
import { track } from './tracker/tracker';
import mongoose from 'mongoose';
import * as Sentry from '@sentry/node';
import User from './schemas/User';

process.env.NODE_ENV = 'development';

const client = new Shard();

client.on('shardReady', (shard) => {
    console.log(`Shard ${shard[0]} is ready!`);

    // @ts-ignore
    //client.updatePresence({ status: 'online', name: 'Tracking Presences' });

    setInterval(() => {
        track(client);
    }, 1000 * 60 * 2);
});

loadCommands(client.client.commands);

// Command handler
client.on('interactionCreate', async (interaction) => {
    // Start a transaction for the interaction
    await Sentry.startSpan(
        { name: `Command: ${interaction.commandName}`, op: 'interaction' },
        async (interactionSpan) => {
            try {
                interaction.user = { id: interaction.data.member.user.id, username: interaction.data.member.user.username };

                const command = client.client.commands.get(
                    interaction.commandName
                );
                if (!command) {
                    interactionSpan.setStatus({
                        code: 2,
                        message: 'Command not found',
                    });
                    return;
                }

                let user;

                // Span for database operation: Find user
                await Sentry.startSpan(
                    { name: 'Find User in DB', op: 'db.query' },
                    async (dbFindSpan) => {
                        user = await User.findOne({ _id: interaction.user.id });
                        if (!user) {
                            dbFindSpan.setStatus({
                                code: 2,
                                message: 'User not found',
                            });
                        } else {
                            dbFindSpan.setStatus({ code: 1 });
                        }
                    }
                );

                if (!user) {
                    // Span for database operation: Create user
                    await Sentry.startSpan(
                        { name: 'Create User in DB', op: 'db.query' },
                        async (dbCreateSpan) => {
                            user = await User.create({
                                _id: interaction.user.id,
                                tracking: false,
                                joined: Date.now(),
                            });
                            dbCreateSpan.setStatus({ code: 1 });
                        }
                    );
                }

                // Span for command execution
                await Sentry.startSpan(
                    {
                        name: `Execute Command: ${interaction.commandName}`,
                        op: 'command.run',
                    },
                    async (commandSpan) => {
                        try { // @ts-ignore
                            await command.run({ interaction, client });
                            commandSpan.setStatus({ code: 1});
                        } catch (error) {
                            Sentry.captureException(error);
                            commandSpan.setStatus({ code: 2, message: 'Command execution error' });
                            interaction.reply({
                                content:
                                    'There was an error while executing this command!',
                                ephemeral: true,
                            });
                        }
                    }
                );
            } catch (error) {
                // Capture any unhandled errors in Sentry
                Sentry.captureException(error);
                interactionSpan.setStatus({ code: 2, message: 'Unhandled error' });
            } finally {
                // End the parent span (interactionSpan) when done
                interactionSpan.setStatus({ code: 1 });
            }
        }
    );
});

mongoose.connect(config.mongo);

client.login(config.token);
