require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType, Application } = require('discord.js');

const commands = [
    {
        name: 'add',
        description: 'Adds name to list.',
        options: [
            {
                name: 'name',
                description: 'The players name.',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {
        name: 'delete',
        description: 'Deletes name from list.',
        options: [
            {
                name: 'name',
                description: 'The players name.',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {
        name: 'list',
        description: 'Lists players in lobby.',
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log('Slash commands were registered successfully!');
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();