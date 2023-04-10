const Discord = require("discord.js")
const emojis = require("../emojis.json")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db = new JsonDatabase({ databasePath:"./databases/myJsonCupons.json" });

module.exports = {
    name: "ccupom", 
    run: async(client, message, args) => {
      if(message.author.id !== `${perms.get(`${message.author.id}_id`)}`) return message.reply(`<:error:1069750943417122846> | Você não está na lista de pessoas!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      if(!args[0]) return message.reply(`<:error:1069750943417122846> | Você não selecionou nenhum ID!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      if(args[1]) return message.reply(`<:error:1069750943417122846> | Você não pode selecionar dois IDs de uma vez!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      if(args[0] !== `${db.get(`${args[0]}.idcupom`)}`) return message.reply(`<:error:1069750943417122846> | Esse ID de cupom não é existente!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
        
      const adb = args[0];
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('qtdcupom')
            .setEmoji(emojis.config)
            .setLabel('Quantidade')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('mincupom')
            .setEmoji(emojis.config)
            .setLabel('Mínimo')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('pctcupom')
            .setEmoji(emojis.config)
            .setLabel('Porcentagem')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('relcupom')
            .setEmoji(emojis.certo)
            .setLabel('Atualizar')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('delcupom')
            .setEmoji(emojis.errado)
            .setLabel('Excluir')
            .setStyle('DANGER'),
        );
        
        const msg = await message.reply({ embeds: [new Discord.MessageEmbed()
          .setTitle(`${client.user.username} | Configurando o cupom ${adb}`)
          .setDescription(`
${emojis.mundo} | **Quantidade:**
\`\`${db.get(`${adb}.quantidade`)}\`\`

${emojis.money} | **Mínimo:**
\`\`${db.get(`${adb}.minimo`)}\`\`

${emojis.cupom} | **Porcentagem:**
\`\`${db.get(`${adb}.desconto`)}%\`\`  `)
          .setThumbnail(client.user.displayAvatarURL())
          .setColor(config.get(`color`))], components: [row]})
        const interação = msg.createMessageComponentCollector({ componentType: "BUTTON", })
        interação.on("collect", async (interaction) => {
         if (message.author.id != interaction.user.id) {
          return;
         }
                
         if (interaction.customId === "delcupom") {
           msg.delete()
           msg.channel.send(`${emojis.certo} | excluido!!`)
           db.delete(`${adb}`)
         }
         if (interaction.customId === "qtdcupom") {
             interaction.deferUpdate();
             msg.channel.send(`${emojis.mundo} | envie abaixo a nova quantidade!!`).then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", message => {
                 message.delete()
                 if (isNaN(message.content)) return msg.edit(`${emojis.errado} | Não coloque nenhum caractere especial além de números.`)
                 db.set(`${adb}.quantidade`, `${message.content}`)
                 msg.edit(`${emojis.certo} | atualizado com sucesso!!`)
             })
           })
         }
         if (interaction.customId === "mincupom") {
             interaction.deferUpdate();
             msg.channel.send(`${emojis.mundo} | envie abaixo o novo minimo!!`).then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", message => {
                 message.delete()
                 db.set(`${adb}.minimo`, `${message.content.replace(",", ".")}`)
                 msg.edit(`${emojis.certo} | atualizado com sucesso!!`)
             })
           })
         }
         if (interaction.customId === 'pctcupom') {
             interaction.deferUpdate();
             msg.channel.send(`${emojis.mundo} | envie abaixo a nova porcetagem!!`).then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", message => {
                 message.delete()
                 if(isNaN(message.content)) return msg.edit(`${emojis.errado} | Não coloque nenhum caractere especial além de números.`)
                 db.set(`${adb}.desconto`, `${message.content}`)
                 msg.edit(`${emojis.certo} | atualizado com sucesso!!`)
             })
           })
         }
         if (interaction.customId === 'relcupom') {
           interaction.deferUpdate();
           const embed = new Discord.MessageEmbed()
           .setTitle(`${client.user.username} | Configurando o(a) ${adb}`)
           .setDescription(`
 ${emojis.mundo} | Quantidade: ${db.get(`${adb}.quantidade`)}
 ${emojis.dinheiro} | Mínimo: ${db.get(`${adb}.minimo`)} Reais
 ${emojis.cupom} | Porcentagem: ${db.get(`${adb}.desconto`)}%`)
           .setThumbnail(client.user.displayAvatarURL())
             .setThumbnail(client.user.displayAvatarURL())
             .setColor(config.get(`color`))
           msg.edit({ embeds: [embed] })
           message.channel.send(`${emojis.mundo} | atualizado!!`)
             }
           })
         }
       }