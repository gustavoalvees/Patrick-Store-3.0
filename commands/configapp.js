const Discord = require("discord.js")
const emojis = require("../emojis.json")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });

module.exports = {
    name: "configapp", 
    run: async(client, message, args) => {
      if(message.author.id !== `${perms.get(`${message.author.id}_id`)}`) return message.channel.send(`${emojis.errado} | Você não está na lista de pessoas!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('alterarlogs')
            .setEmoji(emojis.config)
            .setLabel('alterar logs')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('prefixconfig')
            .setEmoji(emojis.config)
            .setLabel('alterar Prefixo')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('reembolsar')
            .setEmoji(emojis.config)
            .setLabel('alterar logs reembolso')
            .setStyle('PRIMARY'),
        )
        
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('statusconfig')
            .setEmoji(emojis.config)
            .setLabel('alterar Status')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('reiniciarbot')
            .setEmoji(emojis.load)
            .setLabel('reiniciar')
            .setStyle('PRIMARY'),
        );
        
        const embed = await message.reply({ embeds: [new Discord.MessageEmbed()
          .setTitle(`${client.user.username} | Configuração do app`)
          .setDescription(`

${emojis.config} | **Prefixo:** 
\`${config.get(`prefix`)}\`

${emojis.mundo} | **Status do Bot:**
 \`${config.get(`status`)}\`
 
 ${emojis.info} | **logs:**
 \`${config.get(`logs`)}\`
 `)
          .setColor(config.get(`color`))], components: [row]})
        const interação = embed.createMessageComponentCollector({ componentType: "BUTTON", });
         interação.on("collect", async (interaction) => {
          if (message.author.id != interaction.user.id) {
           return;
          }

          if (interaction.customId === "alterarlogs") {
            interaction.deferUpdate();
            message.channel.send(`${emojis.mundo} | envie abaixo o novo webbook (link)!! **obs: mande o webbook certo ou o bot podera ter poblemas futuros**`).then(msg => {
             const filter = m => m.author.id === interaction.user.id;
             const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", logs => {
                 logs.delete()
                 const newt = logs.content
                 config.set(`logs`, newt)
                 msg.edit(`${emojis.certo} | alterado com sucesso!`)
                            
                 const embednew = new Discord.MessageEmbed()
                   .setTitle(`${client.user.username} | Configuração dos status`)
                    .setDescription(`

                   ${emojis.config} | **Prefixo:** 
                   \`${config.get(`prefix`)}\`
                   
                   ${emojis.mundo} | **Status do Bot:**
                    \`${config.get(`status`)}\`
                    
                    ${emojis.info} | **logs:**
                    \`${config.get(`logs`)}\`
                    `)
                   .setColor(config.get(`color`))
                 embed.edit({ embeds: [embednew] })
                 })
               })
             }
          if (interaction.customId === "prefixconfig") {
            interaction.deferUpdate();
            message.channel.send(`${emojis.mundo} | envie abaixo o novo prefix!!`).then(msg => {
             const filter = m => m.author.id === interaction.user.id;
             const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", prefix => {
                 prefix.delete()
                 const newt = prefix.content
                 config.set(`prefix`, newt)
                 msg.edit(`${emojis.certo} | alterado com sucesso!`)
                            
                 const embednew = new Discord.MessageEmbed()
                   .setTitle(`${client.user.username} | Configuração dos status`)
                   .setDescription(`

                   ${emojis.config} | **Prefixo:** 
                   \`${config.get(`prefix`)}\`
                   
                   ${emojis.mundo} | **Status do Bot:**
                    \`${config.get(`status`)}\`
                    
                    ${emojis.info} | **logs:**
                    \`${config.get(`logs`)}\`
                    `)
                 embed.edit({ embeds: [embednew] })
                 })
               })
             }
             if (interaction.customId === "reembolsar") {
              interaction.deferUpdate();
              message.channel.send(`${emojis.mundo} | envie abaixo o novo webbook (link)!! **obs: mande o webbook certo ou o bot podera ter poblemas futuros**`).then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
                 collector.on("collect", prefix => {
                   prefix.delete()
                   const newt = prefix.content
                   config.set(`reembolso`, newt)
                   msg.edit(`${emojis.certo} | alterado com sucesso!`)
                              
                   const embednew = new Discord.MessageEmbed()
                     .setTitle(`${client.user.username} | Configuração dos status`)
                     .setDescription(`
  
                     ${emojis.config} | **Prefixo:** 
                     \`${config.get(`prefix`)}\`
                     
                     ${emojis.mundo} | **Status do Bot:**
                      \`${config.get(`status`)}\`
                      
                      ${emojis.info} | **logs:**
                      \`${config.get(`logs`)}\`
                      `)
                   embed.edit({ embeds: [embednew] })
                   })
                 })
               }
             if (interaction.customId === "reiniciarbot") {
              interaction.deferUpdate();
              axios.post(`https://api.discloud.app/v1/public/start/8077b8a9977143dc8401150d0b06e42a`, {}, {
                headers: {
                  Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk1ODEzNTExNDgyNTYyMTU1NSIsImtleSI6IjFpQTdHdzJkIn0.m00U7sCkqrk4F6PQEzQxa3VBT8u1MB9DLWU0JyrwVLQ' 
                }
              }).then(async (r) => {
                msg.channel("Bot ligado")
                          
                   
                 })
               }
          if (interaction.customId === "statusconfig") {
            interaction.deferUpdate();
            message.channel.send(`${emojis.mundo} | envie abaixo o  novo status!!`).then(msg => {
             const filter = m => m.author.id === interaction.user.id;
             const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", status => {
                 status.delete()
                 const newt = status.content
                 config.set(`status`, newt)
                 msg.edit(`${emojis.certo} | alterado com sucesso!!`)
                            
                 const embednew = new Discord.MessageEmbed()
                   .setTitle(`${client.user.username} | Configuração dos status`)
                   .setDescription(`

                   ${emojis.config} | **Prefixo:** 
                   \`${config.get(`prefix`)}\`
                   
                   ${emojis.mundo} | **Status do Bot:**
                    \`${config.get(`status`)}\`
                    
                    ${emojis.info} | **logs:**
                    \`${config.get(`logs`)}\`
                    `)
                   .setColor(config.get(`color`))
                 embed.edit({ embeds: [embednew] })
                 })
               })
             }
           })
         }
       };