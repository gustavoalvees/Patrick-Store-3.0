const Discord = require("discord.js")
const emojis = require("../emojis.json")
const { JsonDatabase, } = require("wio.db");
const db3 = new JsonDatabase({ databasePath:"./databases/myJsonIDs.json" });
const config = new JsonDatabase({ databasePath:"./config.json" });

module.exports = {
    name: "info",
    run: async(client, message, args) => {
      const embederro2 = new Discord.MessageEmbed()
      if (!args[0]) return message.reply(`<:error:1069750943417122846> | Você não selecionou nenhum ID de compra!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      if(args[0] !== `${db3.get(`${args[0]}.id`)}`) return message.reply(`<:error:1069750943417122846> | Esse ID de compra não é existente!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
        
      const id = args[0]
      const embed = new Discord.MessageEmbed()
        .setTitle(`${emojis.certo} | ${client.user.username} Compra Aprovada`)
        .addField(`${emojis.seguranca} | ID Da compra:`, `${db3.get(`${args[0]}.id`)}`)
        .addField(`${emojis.info} | Status:`, `${db3.get(`${args[0]}.status`)}`)
        .addField(`${emojis.dados} | Comprador:`, `<@${db3.get(`${args[0]}.userid`)}>`)
        .addField(`${emojis.mundo} | Data da compra:`, `${db3.get(`${args[0]}.dataid`)}`)
        .addField(`${emojis.money} | Produto:`, `${db3.get(`${args[0]}.nomeid`)}`)
        .addField(`${emojis.dinheiro} | Quantidade:`, `${db3.get(`${args[0]}.qtdid`)}`)
        .addField(`${emojis.money} | Preço:`, `${db3.get(`${args[0]}.precoid`)}`)
        .setColor(config.get(`color`))
      message.reply({embeds: [embed], content: " | Encontrado!"})
    }
}