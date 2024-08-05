import { Command, MessageEmbed } from "../../aetherial/src"
import { ShardInteraction } from "../../aetherial/src/sharding/ShardInteraction";

export default {
    name: 'ping',
    description: 'Ping!',
    async run({ interaction }) {
        if(interaction instanceof ShardInteraction !== true) return; // Typed it wrong L

        let ldEmbed = new MessageEmbed().setColor(0x2f3136).setDescription('Pinging... <a:Loading:1270072089730093118>');
        interaction.reply({ embeds: [ldEmbed] }).then((msg) => {
            interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor(0x2f3136)
                        .addField('Latency', `${msg.createdTimestamp - interaction.createdTimestamp}ms`)
                        .addField('API Latency', `${Math.round(interaction.client.ping)}ms`)
                ]
            })
        });
    }
} as Command<ShardInteraction>;