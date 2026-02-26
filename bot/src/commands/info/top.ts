import * as Sentry from '@sentry/node';
import { Command, MessageEmbed } from 'aetherial';
import Activity from '../../schemas/Activity';
import convertMs from '../../utils/convertMs';
import activityView from '../../views/activity';

export default {
    name: 'top',
    description: 'Shows your top activities',
    async run({ interaction }) {
        // Start a Sentry transaction for the command execution
        return Sentry.startSpan({ name: 'Top Command', op: 'command.run' }, async (commandSpan) => {
            try {
                let id = interaction.data.member.user.id; // User ID
                let activities;

                // Add a span for the database query
                await Sentry.startSpan({ name: 'Fetch Activities', op: 'db.query' }, async (dbSpan) => {
                    activities = await Activity.find({ id })
                        .sort({ duration: -1 })
                        .limit(10);
                    dbSpan.setStatus({ code: 1 }); // Status OK for DB query
                });

                if (!activities.length) {
                    commandSpan.setStatus({
                        code: 1,
                        message: 'No activities found for the user',
                    }); // Status OK, but no data found
                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(0xed4245)
                                .setDescription('You have no activities tracked yet!')
                                .setFooter({
                                    text: 'Start tracking your activities by using the `/track` command',
                                }),
                        ],
                    });
                }

                // Calculate total duration and generate response embed
                let totalDuration = activities.reduce((acc, curr) => acc + curr.duration, 0);
                let embed = new MessageEmbed()
                    .setColor(0x2f3136)
                    .setTitle('Top Activities')
                    .setDescription(
                        `You've played for ${convertMs(totalDuration)} in total\nHere are your top activities:`
                    )
                    .setTimestamp(Date.now())
                    .setFooter({
                        text: `You can stop tracking your activities by using the /deactivate command at any time`,
                    });

                // Add activities to the embed
                for (let activity of activities) {
                    let view = activityView(activity);
                    embed.addField(view[0], view[1]);
                }

                // Reply with the embed
                commandSpan.setStatus({ code: 1 }); // Status OK
                return interaction.reply({ embeds: [embed] });
            } catch (error) {
                // Capture exceptions in Sentry
                Sentry.captureException(error);
                commandSpan.setStatus({
                    code: 2, // @ts-ignore
                    message: `Command execution error: ${error.message}`,
                }); // Error status
                console.error(error);

                return interaction.reply({
                    content: 'An error occurred while processing your request. Please try again later.',
                    ephemeral: true,
                });
            } finally {
                commandSpan.end(); // Ensure the span is closed
            }
        });
    },
} as Command;
