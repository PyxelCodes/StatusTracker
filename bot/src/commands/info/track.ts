import { Command, MessageEmbed, WebhookClient } from '../../aetherial/src';
import User from '../../schemas/User';
import config from '../../../config.json';

export default {
    name: `track`,
    description: `Start tracking your activities`,
    async run({ interaction }) {
        let state = await User.findOne({ _id: interaction.user.id });
        if (state.tracking === null) {
            await User.updateOne(
                { _id: interaction.user.id },
                { tracking: true }
            );
        }
        if (state.tracking === true) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(0x924dbf)
                        .setDescription(
                            `You are already tracking your activities`
                        ),
                ],
            });
        }

        await User.updateOne({ _id: interaction.user.id }, { tracking: true });

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(0x924dbf)
                    .setDescription(
                        `You have successfully started tracking your activities`
                    ),
            ],
        });

        new WebhookClient({url: config.logWebhook }).send({
            embeds: [
                new MessageEmbed()
                    .setColor(0x924dbf)
                    .setDescription(
                        `${interaction.user.username} has started tracking their activities`
                    ),
            ]
        })

    },
} as Command;
