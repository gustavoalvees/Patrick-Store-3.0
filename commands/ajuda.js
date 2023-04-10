const Discord = require("discord.js")
const emojis = require("../emojis.json")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });

module.exports = {
    name: "ajuda",
    run: async(client, message, args) => {        
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('retornar')
            .setEmoji(emojis.anterior)
          .setLabel(`anterior`)
            .setDisabled(true)
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('proxima')
           .setLabel(`proximo`)
            .setEmoji(emojis.proximo)
            .setDisabled(false)
            .setStyle('PRIMARY'),
        );
        
        const embed = await message.reply({ embeds: [new Discord.MessageEmbed()
          .setTitle(`${config.get(`title`)} | Meus Comandos`)
          .setDescription(`
${emojis.mundo} | **${config.get(`prefix`)}ajuda** - *Veja meus comandos*
${emojis.mundo} | **${config.get(`prefix`)}anuncio **- *Envie um anuncio Embed*
${emojis.mundo} | **${config.get(`prefix`)}botinfo** - *Veja minhas info*
${emojis.mundo} | **${config.get(`prefix`)}info** - *Veja info de uma compra*
${emojis.mundo} | **${config.get(`prefix`)}perfil** - *Veja seu perfil*
${emojis.mundo} | **${config.get(`prefix`)}status** - *Veja os status de vendas*
${emojis.mundo} | **${config.get(`prefix`)}rendimentos** - *Veja seus rendimentos*
${emojis.mundo} | **${config.get(`prefix`)}pegar** - *Veja um produto entregue*
${emojis.mundo} | **${config.get(`prefix`)}pagar** - *Sete um id para pago*
${emojis.mundo} | **${config.get(`prefix`)}criargift** - *Crie um Gift*
${emojis.mundo} | **${config.get(`prefix`)}criarcupom** - *Crie um cupom*
${emojis.mundo} | **${config.get(`prefix`)}configcupom** - *Gerencie um cupom*
${emojis.mundo} | **${config.get(`prefix`)}limpar** - *Apague as mensagens do chat*
${emojis.mundo} | **${config.get(`prefix`)}limpardm** - *Apague as mensagens do bot na sua DM*
`)
          .setTimestamp()
          .setFooter(`Pagina 1/2`)
          .setThumbnail(client.user.displayAvatarURL())
          .setColor(config.get(`color`))], components: [row]})
        const interação = embed.createMessageComponentCollector({ componentType: "BUTTON", })
         interação.on("collect", async (interaction) => {
          if (message.author.id != interaction.user.id) { return; }
            if (interaction.customId === 'retornar') {
              interaction.deferUpdate();
              row.components[0].setDisabled(true)
              row.components[1].setDisabled(false)
              const embednew = new Discord.MessageEmbed()
                .setTitle(`${client.user.username} | Meus Comandos`)
                .setDescription(`
${emojis.mundo} | **${config.get(`prefix`)}ajuda** - *Veja meus comandos*
${emojis.mundo} | **${config.get(`prefix`)}anuncio** - *Envie um anuncio Embed*
${emojis.mundo} | **${config.get(`prefix`)}botinfo** - *Veja minhas info*
${emojis.mundo} | **${config.get(`prefix`)}info** - *Veja info de uma compra*
${emojis.mundo} | **${config.get(`prefix`)}perfil** - *Veja seu perfil*
${emojis.mundo} | **${config.get(`prefix`)}status** - *Veja os status de vendas*
${emojis.mundo} | **${config.get(`prefix`)}rendimentos** - *Veja seus rendimentos*
${emojis.mundo} | **${config.get(`prefix`)}pegar** - *Veja um produto entregue*
${emojis.mundo} | **${config.get(`prefix`)}pagar** - *Altere um id para pago*
${emojis.mundo} | **${config.get(`prefix`)}criarcupom** - *Crie um cupom*
${emojis.mundo} | **${config.get(`prefix`)}configcupom** - *Gerencie um cupom*
${emojis.mundo} | **${config.get(`prefix`)}clear** - *Apague as mensagens do chat*
${emojis.mundo} | **${config.get(`prefix`)}criados** - *Veja todos os produtos/cupons/gifts criados*
`)
                .setTimestamp()
                .setFooter(`Pagina 1/2`)
                .setThumbnail(client.user.displayAvatarURL())
                .setColor(config.get(`color`))
              embed.edit({ embeds: [embednew], components: [row] })
            }
             
            if (interaction.customId === 'proxima') {
              interaction.deferUpdate();
              row.components[0].setDisabled(false)
              row.components[1].setDisabled(true)
              const embednew = new Discord.MessageEmbed()
                .setTitle(`${config.get(`title`)} | Meus Comandos`)
                .setDescription(`
${emojis.mundo} | **${config.get(`prefix`)}criar** - *Crie um anuncio*
${emojis.mundo} | **${config.get(`prefix`)}setar** - *Sete um anuncio*
${emojis.mundo} | **${config.get(`prefix`)}config** - *Gerencie um anuncio*
${emojis.mundo} | **${config.get(`prefix`)}estoque** - *Gerencie um estoque*
${emojis.mundo} | **${config.get(`prefix`)}rank** - *Veja o Ranking de Clientes*
${emojis.mundo} | **${config.get(`prefix`)}configbot** - *Configura o bot*
${emojis.mundo} | **${config.get(`prefix`)}configcanais** - *Configura os canais*
${emojis.mundo} | **${config.get(`prefix`)}configstatus** - *Configura os status*
${emojis.mundo} | **${config.get(`prefix`)}permadd** - *Adicione um administrador*
${emojis.mundo} | **${config.get(`prefix`)}donoadd** - *Adicione um dono*
${emojis.mundo} | **${config.get(`prefix`)}permdel** - *Remova um administrador*
${emojis.mundo} | **${config.get(`prefix`)}donodel** - *Remova um dono*
`)
                .setTimestamp()
                .setFooter(`Pagina 2/2`)
                .setThumbnail(client.user.displayAvatarURL())
                .setColor(config.get(`color`))
              embed.edit({ embeds: [embednew], components: [row] })
              }
            })
          }
        }