const { Client, MessageEmbed, Util, Collection } = require('discord.js');
const client = new Client();
const { token } = require('./config.json');
const { readdirSync } = require('fs');

client.on("ready", () =>{
    console.log(`${client.user.username} is Starting!`)

    client.user.setPresence({
        activity: {
            name: "Prefix '?'",
            type: 'PLAYING'
        },
        status: 'online'
    })
})

client.commands = new Collection();
client.aliases = new Collection();
client.categories = readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("message", async message => {
    if (message.author.bot) return;
    const prefix = '?'
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) command.run(client, message, args);


})

client.login(token)