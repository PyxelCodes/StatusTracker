import { writeFileSync } from "fs";
import { formatEmojis } from "./fetch";
import { logger } from "../logger";

const fetch = async () => {
    let emojis = await formatEmojis('1255936103467323402');
    logger.scope(`Emoji`).success(`Fetched ${Object.keys(emojis).length} emojis`);
    writeFileSync('../emojis.json', JSON.stringify(emojis));
}

fetch();
setInterval(fetch, 1000 * 60 * 15);