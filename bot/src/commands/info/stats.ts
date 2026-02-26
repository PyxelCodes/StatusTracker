import { Command, MessageEmbed, Shard } from 'aetherial';
import Activity from '../../schemas/Activity';
import User from '../../schemas/User';
import aetherialPKG from 'aetherial/package.json';

export default {
    name: 'stats',
    description: "Shows the bot's stats",
    async run(params) {
        const interaction = params.interaction;
        const client = interaction.client as unknown as Shard;

        let dbSize = await Activity.estimatedDocumentCount();
        let distinctActivities = await Activity.distinct('name');
        let userSize = await User.estimatedDocumentCount();

        let embed = new MessageEmbed()
            .setTitle('Bot Stats')
            .setDescription("Here are the bot's stats")
            .setColor(0x2f3136)
            .addField('Users', userSize.toString())
            .addField('Activities', dbSize.toString())
            .addField(`Unique Activities`, distinctActivities.length.toString())
            .addField('Guilds', client.guilds.size.toString())
            .addField('WebSocket Latency', client.ping + 'ms')
            .addField(
                'Memory Usage',
                `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
                    2
                )} MB`
            )
            .setFooter({ text: `Running on Aetherial ShardMG v${aetherialPKG.version}` })
            .setTimestamp(Date.now());

        return interaction.reply({ embeds: [embed] });
    },
} as Command;
