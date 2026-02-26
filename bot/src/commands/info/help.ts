import { Command, MessageEmbed } from 'aetherial';

export default {
    name: `help`,
    description: `Shows all available commands`,

    async run({ interaction }) {
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `Here are the commands you can use with the bot:\n\`/track\` - Start tracking your activities\n\`/deactivate\` - Stop tracking your activities\n\`/global\` - Shows global top played activities\n\`/top\` - Shows your top played activities\n\`/stats\` - Shows bot statistics\n\`/info\` - Shows information about the bot\n\`/help\` - Shows all available commands`
                    )
                    .setFooter({
                        text: `The bot is not collecting ANY data unless you activate it using /track. You can deactivate it using /deactivate. only playtime and session data is stored`,
                    }),
            ],
        });
    },
} as Command;
