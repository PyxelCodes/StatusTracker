import Aetherial from 'aetherial';
import config from '../config.json';
import signale from 'signale';

const client = new Aetherial.Client(config.token, config.publicKey);

client.on('ready', () => {
    signale.success(`StatusTracker is ready!`);
})