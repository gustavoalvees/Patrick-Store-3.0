const Discord = require("discord.js")
const emojis = require("../emojis.json")
const { JsonDatabase, } = require("wio.db");
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });

module.exports = {
    name: "limpar", 
    run: async(client, message, args) => {
      if(message.author.id !== `${perms.get(`${message.author.id}_id`)}`) return message.reply(`<:error:1069750943417122846> | Você não está na lista de pessoas!`)
      setTimeout(() => message.channel.bulkDelete(100).catch(err => {
        return message.channel.send(`<:error:1069750943417122846> | Ocorreu algum erro!`);
      }), 400)
      setTimeout(() => message.delete().then(msg => {
        return message.channel.send(`${emojis.certo} | Mensagens deletadas!`)
      }), 300)
   }
}