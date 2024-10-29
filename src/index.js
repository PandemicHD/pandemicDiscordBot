require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const fs = require('fs');
const https = require('https');

let lobbyList = [];

function loadLobbyList() {
    try {
        const data = fs.readFileSync('lobbyList.txt', 'utf8');
        lobbyList = data ? data.split(', ') : [];
        console.log('Loaded lobby list:', lobbyList);
    } catch (err) {
        console.log('No existing lobby list found, starting with an empty list.');
        lobbyList = [];
    }
}

function saveLobbyList() {
    const data = lobbyList.join(', ');
    fs.writeFileSync('lobbyList.txt', data, (err) => {
        if (err) console.error('Error saving lobby list:', err);
    });
}

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`✅ ${c.user.username} is online.`);
    loadLobbyList();
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'add') {
        const name = interaction.options.get('name').value;

        interaction.reply(`Added ${name} to list.`);
        lobbyList.push(name);

        saveLobbyList();
        console.log(lobbyList);
    }

    if (interaction.commandName === 'delete') {
        const name = interaction.options.get('name').value;

        const index = lobbyList.indexOf(name);
        if (index !== -1) {
            lobbyList.splice(index, 1);
            interaction.reply(`Removed ${name} from list.`);
            saveLobbyList();
        } else {
            interaction.reply(`${name} was not found in the list.`);
        }
    }

    if (interaction.commandName === 'list') {
        const lobbyListString = lobbyList.length > 0 ? lobbyList.join(', ') : 'The list is empty.';
        
        interaction.reply(lobbyListString);
    }
});

const PORT = 3000;
const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};


https.createServer(options, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(lobbyList.join(', '));
}).listen(PORT, () => {
    console.log(`HTTP server running at https://localhost:${PORT}`);
});

client.login(process.env.TOKEN);