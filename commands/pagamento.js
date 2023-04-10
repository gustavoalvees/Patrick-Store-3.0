const Discord = require("discord.js")
const emojis = require("../emojis.json")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db = new JsonDatabase({ databasePath:"./databases/myJsonBotConfig.json" });
const dbB = new JsonDatabase({ databasePath:"./databases/myJsonBotConfig.json" });

module.exports = {
    name: "configtermos", 
    run: async(client, message, args) => {
      if(message.author.id !== `${perms.get(`${message.author.id}_id`)}`) return message.reply(`${emojis.errado} **| você não tem perm.**`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
       
      const chave = args[0];
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('pagamento')
            .setEmoji(emojis.config)
            .setLabel('acess token')
            .setStyle('SUCCESS'),
        )
        .addComponents(
            new Discord.MessageButton()
              .setCustomId('attermos')
              .setEmoji(emojis.certo)
              .setLabel('Atualizar')
              .setStyle('SUCCESS'),
          );

        const msg = await message.reply({ embeds: [new Discord.MessageEmbed()
          .setTitle(`Bot Store | Configurando o pagamento`)
          .setDescription(`${emojis.mundo} | caso nao saiba pegar acess token do mercado pago [clique aqui](https://www.youtube.com/watch?v=WWcGuv74vbs)

${emojis.segurança} | nao compartilhe sua acess token `)
          .setThumbnail(client.user.displayAvatarURL())
          .setColor(`#000CD`)], components: [row]})
        const interação = msg.createMessageComponentCollector({ componentType: "BUTTON", })
        interação.on("collect", async (interaction) => {
         if (message.author.id != interaction.user.id) {
          return;
         }
                

          if (interaction.customId === "pagamento") {
              interaction.deferUpdate();
              msg.channel.send(`${emojis.mundo} | **envie abaixo a nova acess token!!**`).then(msg => {
                const filter = m => m.author.id === interaction.user.id;
                const collector = msg.channel.createMessageCollector({ filter, max: 1 });
                collector.on("collect", message => {
                  message.delete()
                  db.set(`acesstoken`, `${message.content}`)
                  msg.edit(`${emojis.certo} | **alterado com sucesso!**`)
              })
            })
          }
        
          if (interaction.customId === 'attermos') {
            interaction.deferUpdate();
            const embed = new Discord.MessageEmbed()
           .setTitle(`Bot Store | Configurando o pagamento`)
          .setDescription(`${emojis.mundo} | caso nao saiba pegar acess token do mercado pago (clique aqui)[]

${emojis.segurança} | nao compartilhe sua acess token `)
          
              .setThumbnail(client.user.displayAvatarURL())
              .setColor(`${db.get(`cor`)}`)
            msg.edit({ embeds: [embed] })
            message.channel.send(`${emojis.certo} | **atualizado com sucesso!**`)
              }
            })
          }
        }