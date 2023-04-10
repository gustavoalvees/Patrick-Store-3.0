const Discord = require("discord.js")
const emojis = require("../emojis.json")

module.exports = {
    name: "botinfo", // Coloque o nome do comando do arquivo
    aliases: ["infobot"], // Coloque sinônimos aqui

    run: async (client, message, args) => {

        let servidor = client.guilds.cache.size;
        let usuarios = client.users.cache.size;
        let canais = client.channels.cache.size;
        let ping = client.ws.ping;
        let dono_id = "1048099865336500296"; // Seu ID
        let dono = client.users.cache.get(dono_id);
        let prefixo = ".";
        let versao = "3.0";

        let embed = new Discord.MessageEmbed()
            .setColor("#00FFFF")
            .setTimestamp(new Date)
            .setDescription(`${emojis.mundo}  | Olá, tudo bem? me chamo, **[${client.user.username}](https://discord.gg/patrickstore)**  e fui desenvolvido para facilitar a vida dos meus usuários.


\ **・⛄| Desenvolvedores: ** [! Patrick#2006](hhttps://discord.gg/patrickstore)
\ **・🌈| Linguagem: ** [node.js](https://nodejs.org/en/)
\ **・🛡| Versão: ** ${versao}

\ **・🗡 | Ping:** ${ping}`);



        message.reply({ embeds: [embed] })



    }
}