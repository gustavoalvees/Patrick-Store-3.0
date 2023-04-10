const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });

module.exports = {
    name: "configstatus", 
    run: async(client, message, args) => {
      if(message.author.id !== `${perms.get(`${message.author.id}_id`)}`) return message.channel.send(`<:icons_Wrong:1069731513765199892> | Você não está na lista de pessoas!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('tokenconfig')
            .setEmoji('<:cx2_atualizado:1069739526504857780>')
            .setLabel('Mercado Pago')
            .setStyle('SECONDARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('prefixconfig')
            .setEmoji('<:cx2_atualizado:1069739526504857780>')
            .setLabel('Prefixo')
            .setStyle('SECONDARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('statusconfig')
            .setEmoji('<:cx2_atualizado:1069739526504857780>')
            .setLabel('Status')
            .setStyle('SECONDARY'),
        );
        
        const embed = await message.reply({ embeds: [new Discord.MessageEmbed()
          .setTitle(`${config.get(`title`)} | Configuração dos status`)
          .setDescription(`
<:MP:1030151041901133834> | Token Mercado Pago: \`\Token Seguro\`
<:cifraoinsignia_insigniadev:1030151198206070865> | Prefixo: \`${config.get(`prefix`)}\`
<a:loading:1049060806374985862> | Status do Bot: \`${config.get(`status`)}\``)
          .setColor(config.get(`color`))], components: [row]})
        const interação = embed.createMessageComponentCollector({ componentType: "BUTTON", });
         interação.on("collect", async (interaction) => {
          if (message.author.id != interaction.user.id) {
           return;
          }

          if (interaction.customId === "tokenconfig") {
            interaction.deferUpdate();
            message.channel.send("❓ | Qual o novo access token do seu mp?").then(msg => {
             const filter = m => m.author.id === interaction.user.id;
             const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", access_token => {
                 access_token.delete()
                 const newt = access_token.content
                 config.set(`access_token`, newt)
                 msg.edit("<a:loading:1049060806374985862> | Alterado!")
                            
                 const embednew = new Discord.MessageEmbed()
                   .setTitle(`${config.get(`title`)} | Configuração dos status`)
                   .setDescription(`
<:MP:1030151041901133834> | Token Mercado Pago: \`\Token Seguro\`
<:cifraoinsignia_insigniadev:1030151198206070865> | Prefixo: \`${config.get(`prefix`)}\`
<a:loading:1049060806374985862> | Status do Bot: \`${config.get(`status`)}\``)
                   .setColor(config.get(`color`))
                 embed.edit({ embeds: [embednew] })
                 })
               })
             }
          if (interaction.customId === "prefixconfig") {
            interaction.deferUpdate();
            message.channel.send("❓ | Qual o novo prefixo do bot?").then(msg => {
             const filter = m => m.author.id === interaction.user.id;
             const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", prefix => {
                 prefix.delete()
                 const newt = prefix.content
                 config.set(`prefix`, newt)
                 msg.edit("<a:loading:1049060806374985862> | Alterado!")
                            
                 const embednew = new Discord.MessageEmbed()
                   .setTitle(`${config.get(`title`)} | Configuração dos status`)
                   .setDescription(`
<:MP:1030151041901133834> | Token Mercado Pago: \`\Token Seguro\`
<:cifraoinsignia_insigniadev:1030151198206070865> | Prefixo: \`${config.get(`prefix`)}\`
<a:loading:1049060806374985862> | Status do Bot: \`${config.get(`status`)}\``)
                   .setColor(config.get(`color`))
                 embed.edit({ embeds: [embednew] })
                 })
               })
             }
          if (interaction.customId === "statusconfig") {
            interaction.deferUpdate();
            message.channel.send("❓ | Qual os novos status do bot?").then(msg => {
             const filter = m => m.author.id === interaction.user.id;
             const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", status => {
                 status.delete()
                 const newt = status.content
                 config.set(`status`, newt)
                 msg.edit("<a:loading:1049060806374985862> | Alterado!")
                            
                 const embednew = new Discord.MessageEmbed()
                   .setTitle(`${config.get(`title`)} | Configuração dos status`)
                   .setDescription(`
<:MP:1030151041901133834> | Token Mercado Pago: \`\Token Seguro\`
<:cifraoinsignia_insigniadev:1030151198206070865> | Prefixo: \`${config.get(`prefix`)}\`
<a:loading:1049060806374985862> | Status do Bot: \`${config.get(`status`)}\``)
                   .setColor(config.get(`color`))
                 embed.edit({ embeds: [embednew] })
                 })
               })
             }
           })
         }
       };