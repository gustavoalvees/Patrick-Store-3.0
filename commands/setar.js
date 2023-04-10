const Discord = require("discord.js")
const emojis = require("../emojis.json")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db = new JsonDatabase({ databasePath:"./databases/myJsonProdutos.json" });

module.exports = {
    name: "setar", 
    run: async(client, message, args) => {
      if(message.author.id !== `${perms.get(`${message.author.id}_id`)}`) return message.reply(`<:icons_Wrong:1069731513765199892> | VOCÊ NÃO ESTÁ NA LISTA DE PESSOAS!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      if (!args[0]) return message.reply(`${emojis.errado} | Você não selecionou nenhum ID de produto!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      if(args[1]) return message.reply(`${emojis.errado} | Você não selecionar dois IDs de vez!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      if(args[0] !== `${db.get(`${args[0]}.idproduto`)}`) return message.reply(`${emojis.errado} | Esse ID de produto não é existente!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));

      const row = new Discord.MessageActionRow()               
        .addComponents(
          new Discord.MessageButton()
            .setCustomId(args[0])
            .setLabel('Comprar')
            .setEmoji(emojis.carrinho)
            .setStyle('PRIMARY'),
      );
        
      const embed = new Discord.MessageEmbed()
        .setTitle(`${client.user.username} | Bot Store`)
        .setDescription(`\`\`\`${db.get(`${args[0]}.desc`)}\`\`\`\n${emojis.dinheiro} - **Nome:** **__${db.get(`${args[0]}.nome`)}__**\n${emojis.money} - **Preço:** **__R$${db.get(`${args[0]}.preco`)}__**\n${emojis.carrinhoazul} - **Estoque:** **__${db.get(`${args[0]}.conta`).length}__**`)
        .setColor(config.get(`color`))
        .setThumbnail(client.user.displayAvatarURL())
      message.channel.send({embeds: [embed], components: [row]})
    }
}