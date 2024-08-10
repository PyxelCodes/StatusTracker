export default function xfc_alias(uuid: string) {
    return (
        new Map([
            ['Visual Studio Code', 'Code'],
            ['SkyClient', 'Minecraft'],
            ['Minecraft Launcher', 'Minecraft'],
            ['Badlion', 'Minecraft'],
            ['Lunar Client', 'Minecraft']
        ]).get(uuid) || uuid
    );
}
