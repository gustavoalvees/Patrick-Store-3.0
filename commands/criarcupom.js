const Discord = require("discord.js")
const emojis = require("../emojis.json")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db = new JsonDatabase({ databasePath:"./databases/myJsonCupons.json" });

module.exports = {
    name: "criarcupom", 
    run: async(client, message, args) => {
      if(message.author.id !== `${perms.get(`${message.author.id}_id`)}`) return message.reply(`${emojis.errado}| Você não está na lista de pessoas!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      if(!args[0]) return message.reply(`${emojis.errado} | Você não deu nenhum ID a esse cupom!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      if(args[1]) return message.reply(`${emojis.errado} | Você não pode colocar dois IDs de vez!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      if(args[0] === `${db.get(`${args[0]}.idcupom`)}`) return message.reply(`<:error:1069750943417122846> | Esse ID de cupom já é existente!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));

      message.reply(`${emojis.certo} | criado com sucesso!!`)
      const idcupom = args[0]
        db.set(`${idcupom}.idcupom`, `${idcupom}`)
        db.set(`${idcupom}.quantidade`, `0`)
        db.set(`${idcupom}.minimo`, `20`)
        db.set(`${idcupom}.desconto`, `50`)
       }
     }