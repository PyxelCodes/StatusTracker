import axios from 'axios';
import config from '../../config.json';
import { logger } from '../logger';

async function getRemoteEmojis(clientId: string) {
    let remote = await axios.get(
        `https://discord.com/api/v10/applications/${clientId}/emojis`,
        { headers: { Authorization: `Bot ${config.token}` } }
    );
    if (!remote.data) {
        logger.scope(`Emoji`).error('Failed to fetch remote emojis');
    }
    return remote.data;
}

export async function formatEmojis(clientId: string) {
    let emojis = await getRemoteEmojis(clientId);

    let formatted = {} as FormattedEmojiJSON;

    for (let emoji of emojis.items) {
        formatted[emoji.id] = emoji.name;
    }

    return formatted;
}

interface FormattedEmojiJSON {
    [key: string]: string;
}
