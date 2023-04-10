const Discord = require("discord.js")
const emojis = require("../emojis.json")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db = new JsonDatabase({ databasePath:"./databases/myJsonBotConfig.json" });
const dbB = new JsonDatabase({ databasePath:"./databases/myJsonBotConfig.json" });

module.exports = {
    name: "configbot", 
    run: async(client, message, args) => {
      if(message.author.id !== `${perms.get(`${message.author.id}_id`)}`) return message.reply(`❌ | **Você não está na lista de pessoas!**`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
       
      const chave = args[0];
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('logsvendas')
            .setEmoji(emojis.config)
            .setLabel('Logs Vendas')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('catecarrinho')
            .setEmoji(emojis.cnfig)
            .setLabel('Categoria Carrinho')
          .setEmoji(emojis.config)
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('setbanner')
            .setEmoji(emojis.config)
            .setLabel('Banner embed')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('setfoto')
            .setEmoji(emojis.config)
            .setLabel('Foto embed')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('relchave')
            .setEmoji(emojis.load)
            .setLabel('Atualizar')
            .setStyle('PRIMARY'),
        );
        
        const msg = await message.reply({ embeds: [new Discord.MessageEmbed()
          .setTitle(`Bot Store | Configurando o BOT`)
          .setDescription(`
${emojis.config} | **Logs Vendas:** 
<#${db.get(`logs`)}>
${emojis.config} | **Categoria do carrinho:**
<#${db.get(`catecarrinho`)}>
${emojis.config} | **Banner:** 
[Link](${db.get(`banner`)})
${emojis.config} | **Foto:**
[Link](${db.get(`foto`)})`)
          .setThumbnail(client.user.displayAvatarURL())
          .setColor(`${db.get(`cor`)}`)], components: [row]})
        const interação = msg.createMessageComponentCollector({ componentType: "BUTTON", })
        interação.on("collect", async (interaction) => {
         if (message.author.id != interaction.user.id) {
          return;
         }
                
         if (interaction.customId === "delchave") {
           msg.delete()
           msg.channel.send("✅ | Excluido!")
           db.delete(`${chave}`)
         }
         if (interaction.customId === "logsvendas") {
             interaction.deferUpdate();
             msg.channel.send(`${emojis.mundo} | Envie abaixo o novo canal de logs (id)`).then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", message => {
                 message.delete()
                 if (isNaN(message.content)) return msg.edit(`${emojis.errado} | Não coloque nenhum caractere especial além de números.`)
                 db.set(`logs`, `${message.content}`)
                 msg.edit(`${emojis.certo} | Alterado com sucesso!!`)
             })
           })
         }
         if (interaction.customId === "catecarrinho") {
          interaction.deferUpdate();
          msg.channel.send(`${emojis.mundo} | Envie abaixo a nova categoria!! (id)`).then(msg => {
            const filter = m => m.author.id === interaction.user.id;
            const collector = msg.channel.createMessageCollector({ filter, max: 1 });
            collector.on("collect", message => {
              message.delete()
              db.set(`catecarrinho`, `${message.content}`)
              msg.edit(`${emojis.certo} | Alterado com sucesso!!`)
          })
        })
      }
         if (interaction.customId === "setbanner") {
             interaction.deferUpdate();
             msg.channel.send(`${emojis.mundo} | Envie abaixo o novo banner (link)`).then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", message => {
                 message.delete()
                 db.set(`banner`, `${message.content}`)
                 msg.edit(`${emojis.certo} | Alterado com sucesso!!`)
             })
           })
         }
         if (interaction.customId === 'setfoto') {
             interaction.deferUpdate();
             msg.channel.send(`${emojis.mundo} | Envie abaixo a nova foto (link)`).then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", message => {
                 message.delete()
                 db.set(`foto`, `${message.content}`)
                 msg.edit(`${emojis.certo} | Alterado com sucesso!!`)
             })
           })
         }
         if (interaction.customId === 'relchave') {
           interaction.deferUpdate();
           const embed = new Discord.MessageEmbed()
           .setTitle(`Bot Store | Configurando o BOT`)
             .setDescription(`${emojis.config} | **Logs Vendas:** 
<#${db.get(`logs`)}>
${emojis.config} | **Categoria do carrinho:**
<#${db.get(`catecarrinho`)}>
${emojis.config} | **Banner:** 
[Link](${db.get(`banner`)})
${emojis.config} | **Foto:**
[Link](${db.get(`foto`)})`)
             .setThumbnail(client.user.displayAvatarURL())
             .setColor(`${db.get(`cor`)}`)
           msg.edit({ embeds: [embed] })
           message.channel.send(`${emojis.certo} | Atualizado com sucesso!!`)
             }
           })
         }
       }