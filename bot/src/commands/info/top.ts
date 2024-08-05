import { Command, MessageEmbed } from '../../aetherial/src';
import Activity from '../../schemas/Activity';
import convertMs from '../../utils/convertMs';
import emojis from '../../emojis.json';

interface Emojis {
	[key: string]: string;
}

export default {
	name: 'top',
	description: 'Shows your top activities',
	async run({ interaction }) {
		let id = interaction.data.member.user.id; // pov: didn't code this in the lib yet

		let activities = await Activity.find({ id })
			.sort({ duration: -1 })
			.limit(10);

		if (!activities.length) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(0xed4245)
						.setDescription('You have no activities tracked yet!'),
				],
			});
		}

		let embed = new MessageEmbed()
			.setColor(0x2f3136)
			.setTitle('Top Activities')
			.setDescription('Here are your top activities:')
			.setTimestamp(Date.now());

		for (let activity of activities) {
			let emojiName = activity.name.normalize('NFC').replace(/ /gm, "").replace(/\-/gm, "")
			if (emojiName == "TomClancy'sRainbowSixSiege") emojiName = "RainbowSixSiege";
			let emojiId: string = (emojis as Emojis)[emojiName];
			let emoji = emojiId ? `<:${emojiName}:${emojiId}> ` : '';
			embed.addField(`${emoji}${activity.name}`, `Duration: ${convertMs(activity.duration)}`);
		}

		return interaction.reply({ embeds: [embed] });
	},
} as Command;
