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
            .setCustomId('nomebot')
            .setEmoji(emojis.config)
            .setLabel('Nome bot')
            .setStyle('PRIMARY'),
        )

        .addComponents(
          new Discord.MessageButton()
            .setCustomId('minchave')
            .setEmoji(emojis.config)
            .setLabel('Cargo Cliente')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('pctchave')
            .setEmoji(emojis.config)
            .setLabel('Cor Embed')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('tokendomp')
            .setEmoji(emojis.config)
            .setLabel('Token MP')
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
${emojis.config} | **Nome do bot:** 
\`\`${db.get(`nomebot`)}\`\`

${emojis.config} | **Cargo Cliente:** 
<@&${db.get(`cargo`)}>

${emojis.config} | **Token MP:** 
|| Token seguro ||

${emojis.config} | **Cor Embed:**
\`\`${db.get(`cor`)}\`\` `)
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
         if (interaction.customId === "nomebot") {
             interaction.deferUpdate();
             msg.channel.send(`${emojis.mundo} | **envie abaixo o nome do bot**`).then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", message => {
                 message.delete()
                 db.set(`nomebot`, `${message.content}`)
                 msg.edit(`${emojis.certo} | **alterado com sucesso!**`)
             })
           })
         }
         if (interaction.customId === "tokendomp") {
          interaction.deferUpdate();
          msg.channel.send(`${emojis.mundo} **| Envie abaixo o token do mp**`).then(msg => {
            const filter = m => m.author.id === interaction.user.id;
            const collector = msg.channel.createMessageCollector({ filter, max: 1 });
            collector.on("collect", message => {
              message.delete()
              db.set(`acesstoken`, `${message.content}`)
              msg.edit(`${emojis.certo} | **alterado com sucesso!**`)
          })
        })
      }
         if (interaction.customId === "minchave") {
             interaction.deferUpdate();
             msg.channel.send(`${emojis.mundo} **| Envie abaixo o novo cargo de cliente (id)**`).then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", message => {
                 message.delete()
                 db.set(`cargo`, `${message.content.replace(",", ".")}`)
                 msg.edit(`${emojis.certo} | **alterado com sucesso!**`)
             })
           })
         }
         if (interaction.customId === 'pctchave') {
             interaction.deferUpdate();
             msg.channel.send(`${emojis.mundo} **| Envie abaixo a nova cor da embed (em: hex)**`).then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", message => {
                 message.delete()
                 db.set(`cor`, `${message.content}`)
                 msg.edit(`${emojis.certo} | **alterado com sucesso!**`)
             })
           })
         }
         if (interaction.customId === 'relchave') {
           interaction.deferUpdate();
           const embed = new Discord.MessageEmbed()
           .setTitle(`Bot Store | Configurando o BOT`)
             .setDescription(`${emojis.config} | **Nome do bot:** 
\`\`${db.get(`nomebot`)}\`\`

${emojis.config} | **Cargo Cliente:** 
<@&${db.get(`cargo`)}>

${emojis.config} | **Token MP:** 
|| Token seguro ||

${emojis.config} | **Cor Embed:**
\`\`${db.get(`cor`)}\`\` `)
             .setThumbnail(client.user.displayAvatarURL())
             .setColor(`${db.get(`cor`)}`)
           msg.edit({ embeds: [embed] })
           message.channel.send(`${emojis.certo} | **atualizado com sucesso!**`)
             }
           })
         }
       }