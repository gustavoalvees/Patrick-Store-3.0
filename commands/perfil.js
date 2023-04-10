const Discord = require("discord.js")
const emojis = require("../emojis.json")
const { JsonDatabase, } = require("wio.db");
const db2 = new JsonDatabase({ databasePath:"./databases/myJsonDatabase.json" });
const config = new JsonDatabase({ databasePath:"./config.json" });

module.exports = {
    name: "perfil", 
    run: async(client, message, args) => {
     if (!message.mentions.members.first()) {
      const id = message.author.id;
      const gasto = db2.get(`${id}.gastosaprovados`) || "0";
      const pedidos = db2.get(`${id}.pedidosaprovados`) || "0";
        
      const embed = new Discord.MessageEmbed()
        .setTitle(`${client.user.username} | Seu perfil`)
        .addField(`${emojis.mundo} | Produtos comprados:`, `${pedidos} compras realizadas.`)
        .addField(`${emojis.money} | Dinheiro gasto:`, `R$ ${gasto} Reais`)
        .addField(`${emojis.cupom} | cupoms usados:`, `2`)
        .setThumbnail(message.member.user.avatarURL())
        .setColor(config.get(`color`))
      message.reply({embeds: [embed]})
     } else {
      const id = message.mentions.users.first();
      const gasto = db2.get(`${id.id}.gastosaprovados`) || "0";
      const pedidos = db2.get(`${id.id}.pedidosaprovados`) || "0";
        
      const embed = new Discord.MessageEmbed()
        .setTitle(`${cliemt.user.username} | Perfil do ${id.username}`)
        .addField(`${emojis.carrinho} Produtos comprados:`, `${pedidos} compras realizadas.`)
        .addField(`${emojis.money} | Dinheiro gasto:`, `R$ ${gasto} Reais`)
        .setThumbnail(message.member.user.avatarURL())
        .setColor(config.get(`color`))
      message.reply({embeds: [embed]})
     }
   }
}