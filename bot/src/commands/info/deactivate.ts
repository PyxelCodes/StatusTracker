import { Command, MessageEmbed, WebhookClient } from '../../aetherial/src';
import User from '../../schemas/User';
import config from '../../../config.json'

export default {
    name: `deactivate`,
    description: `Stop tracking your activities`,
    async run({ interaction }) {
        let state = await User.findOne({ _id: interaction.user.id });
        if (state.tracking === null) {
            await User.updateOne(
                { _id: interaction.user.id },
                { tracking: false }
            );
        }

        if (state.tracking === false) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(0x924dbf)
                        .setDescription(`You are not tracking your activities`),
                ],
            });
        }

        await User.updateOne({ _id: interaction.user.id }, { tracking: false });
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(0x924dbf)
                    .setDescription(
                        `We have stopped tracking your activities, We will stop all data collection`
                    ),
            ],
        });

        new WebhookClient(config.logWebhook).send({
            embeds: [
                new MessageEmbed()
                    .setColor(0xD84040)
                    .setDescription(
                        `${interaction.user.username} has stopped tracking their activities`
                    ),
            ]
        })
    },
} as Command;
