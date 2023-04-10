const Discord = require("discord.js")
const emojis = require("../emojis.json")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db = new JsonDatabase({ databasePath:"./databases/myJsonProdutos.json" });

module.exports = {
    name: "criar", 
    run: async(client, message, args) => {
      if(message.author.id !== `${perms.get(`${message.author.id}_id`)}`) return message.reply(`<:error:1069750943417122846> | Você não está na lista de pessoas!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      if(!args[0]) return message.reply(`<:error:1069750943417122846> | Você não deu nenhum ID a esse produto!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      if(args[1]) return message.reply(`<:error:1069750943417122846> | Você não pode colocar dois IDs de vez!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      if(args[0] === `${db.get(`${args[0]}.idproduto`)}`) return message.reply(`<:error:1069750943417122846> | Esse ID de produto já é existente!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));

      const row = new Discord.MessageActionRow()               
        .addComponents(
          new Discord.MessageButton()
            .setCustomId(args[0])
            .setLabel('Comprar')
            .setEmoji(emojis.carrinho)
            .setStyle('PRIMARY'),
      );
       
      const adici = new Discord.MessageEmbed()
        .setTitle(`${client.user.username} | Bot Store`)
        .setDescription(`
\`\`\`
Sem descrição ainda...
\`\`\`
**${emojis.dinheiro} | Nome:** __Sem nome ainda...__
**${emojis.money} | Preço:** __10__
**${emojis.carrinhoazul} | Estoque:** __0__`)
        .setColor(config.get(`color`))
        .setThumbnail(client.user.displayAvatarURL())
      message.channel.send({embeds: [adici], components: [row]})
        
      const idproduto = args[0]
        db.set(`${idproduto}.idproduto`, `${idproduto}`)
        db.set(`${idproduto}.nome`, `Sem nome ainda...`) 
        db.set(`${idproduto}.desc`, `Sem descrição ainda...`) 
        db.set(`${idproduto}.preco`, `10`) 

        db.push(`${idproduto}.conta`, `${idproduto}`)
        const a = db.get(`${idproduto}.conta`);
        const removed = a.splice(0, 1);
        db.set(`${idproduto}.conta`, a);
       }
     }