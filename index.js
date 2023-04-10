const Discord = require("discord.js");
const client = new Discord.Client({ intents: 32767 });
const mercadopago = require("mercadopago")
const emojis = require("./emojis.json")
const axios = require("axios")
const moment = require("moment")
const { WebhookClient } = require("discord.js")

const { JsonDatabase, } = require("wio.db");
const db = new JsonDatabase({ databasePath: "./databases/myJsonProdutos.json" });
const dbc = new JsonDatabase({ databasePath: "./databases/myJsonCupons.json" });
const db2 = new JsonDatabase({ databasePath: "./databases/myJsonDatabase.json" });
const db3 = new JsonDatabase({ databasePath: "./databases/myJsonIDs.json" });
const perms = new JsonDatabase({ databasePath: "./databases/myJsonPerms.json" });
const config = new JsonDatabase({ databasePath: "./config.json" });


const { joinVoiceChannel } = require('@discordjs/voice');

client.on("ready", () => {

  let channel = client.channels.cache.get("1049059080376954940"); // ID DA CATEGORIA DO CANAL DE VOZ

  joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  })

  console.log("🔐[" + channel.name + "] call 💻 ")
});

client.on("messageCreate", (mesasge) => {

  let channel = client.channels.cache.get("1049059080376954940"); // ID DA CATEGORIA DO CANAL DE VOZ

  joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  })

});

moment.locale("pt-br");
client.login(config.get(`token`));
client.on('ready', () => {
  console.clear()
  console.log(`👻  | Bot logado com sucesso.
👻  | Bot conectado a DataBase
👻  | Sistema de vendas automáticas
👻  | Patrick Store`);
  client.user.setActivity(`${config.get(`status`)}`, { type: "STREAMING", url: "https://www.twitch.tv/patrickstore" });
});

//Logs de ficar ON

const webhook = new WebhookClient({ url: "https://canary.discord.com/api/webhooks/1069730032358006804/kPoXsbdoa2Rf9DULHOfym4W2328rYFqtejJQGduWuv7kvdCSKwnni24-A6hptaj3r4QH" });
webhook.send(
  {
    embeds: [
      new Discord.MessageEmbed()
        .setColor(config.get(`color`))
        .setTitle(`${emojis.info} | PATRICK LOGS`)
       
        .setDescription(`${emojis.certo} O BOT FOI INICIADO COM SUCESSO!`)
    ]
  });

process.on('unhandledRejection', (reason, p) => {
  console.log('❌  | Algum erro detectado')
  console.log(reason, p)
});
process.on('multipleResolves', (type, promise, reason) => {
  console.log('❌  | Vários erros encontrados')
  console.log(type, promise, reason)
});
process.on('uncaughtExceptionMonito', (err, origin) => {
  console.log('❌  | Sistema bloqueado')
  console.log(err, origin)
});
process.on('uncaughtException', (err, origin) => {
  console.log('❌  | Erro encontrado')
  console.log(err, origin)
});

client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (message.channel.type == 'dm') return;
  if (!message.content.toLowerCase().startsWith(config.get(`prefix`).toLowerCase())) return;
  if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;
  const args = message.content
    .trim().slice(config.get(`prefix`).length)
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  try {
    const commandFile = require(`./commands/${command}.js`)
    commandFile.run(client, message, args);
  } catch (err) { ; }
});

client.on("interactionCreate", (interaction) => {
  if (interaction.isButton()) {
    const eprod = db.get(interaction.customId);
    if (!eprod) return;
    const severi = interaction.customId;
    if (eprod) {
      const quantidade = db.get(`${severi}.conta`).length;
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId(interaction.customId)
            .setLabel('Comprar')
            .setEmoji(emojis.carrinho)
            .setStyle('PRIMARY'),
        );

      const embed = new Discord.MessageEmbed()
        .setTitle(`${config.get(`title`)} | Bot Store`)
        .setDescription(`\`\`\`${db.get(`${interaction.customId}.desc`)}\`\`\`\n${emojis.dinheiro} | **Nome:** **__${db.get(`${interaction.customId}.nome`)}__**\n${emojis.money} | **Preço:** **__R$${db.get(`${interaction.customId}.preco`)}__**\n${emojis.carrinhoazul} | **Estoque:** **__${db.get(`${interaction.customId}.conta`).length}__**`)
        .setColor(config.get(`color`))
        .setThumbnail(client.user.displayAvatarURL())
      interaction.message.edit({ embeds: [embed], components: [row] })

      if (quantidade < 1) {
        const embedsemstock = new Discord.MessageEmbed()
          .setTitle(`${client.user.username} | Sistema de Vendas`)
          .setDescription(`<:icons_Wrong:1069731513765199892> | ESTE PRODUTO ESTÁ SEM ESTOQUE NO MOMENTO, VOLTE MAIS TARDE!`)
          .setColor(config.get(`color`))
        interaction.reply({ embeds: [embedsemstock], ephemeral: true })
        return;
      }

      interaction.deferUpdate()
      if ((interaction.guild.channels.cache.find(c => c.topic === interaction.user.id))) {
        return;
      }

      interaction.guild.channels.create(`🛒・carrinho-${interaction.user.username}`, {
        type: "GUILD_TEXT",
        parent: config.get(`category`),
        topic: interaction.user.id,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS"]
          },
          {
            id: interaction.user.id,
            allow: ["VIEW_CHANNEL"],
            deny: ["SEND_MESSAGES"]
          }
        ]
      }).then(c => {
        let quantidade1 = 1;
        let precoalt = eprod.preco;
        var data_id = Math.floor(Math.random() * 999999999999999);
        db3.set(`${data_id}.id`, `${data_id}`)
        db3.set(`${data_id}.status`, `Pendente (1)`)
        db3.set(`${data_id}.userid`, `${interaction.user.id}`)
        db3.set(`${data_id}.dataid`, `${moment().format('LLLL')}`)
        db3.set(`${data_id}.nomeid`, `${eprod.nome}`)
        db3.set(`${data_id}.qtdid`, `${quantidade1}`)
        db3.set(`${data_id}.precoid`, `${precoalt}`)
        db3.set(`${data_id}.entrid`, `Andamento`)
        const timer2 = setTimeout(function() {
          if ((interaction.guild.channels.cache.find(c => c.topic === interaction.user.id))) { c.delete(); }
          db3.delete(`${data_id}`)
        }, 300000)

        const row = new Discord.MessageActionRow()
          .addComponents(
            new Discord.MessageButton()
              .setCustomId('removeboton')
              .setLabel('')
              .setEmoji(emojis.menos)
              .setStyle('PRIMARY'),
          )
          .addComponents(
            new Discord.MessageButton()
              .setCustomId('comprarboton')
              .setLabel('continuar')
              .setEmoji(emojis.carrinho)
              .setStyle('SUCCESS'),
          )
          .addComponents(
            new Discord.MessageButton()
              .setCustomId('addboton')
              .setLabel('')
              .setEmoji(emojis.mais)
              .setStyle('PRIMARY'),
          )
          .addComponents(
            new Discord.MessageButton()
              .setCustomId('cancelarbuy')
              .setLabel('Cancelar')
              .setEmoji(emojis.errado)
              .setStyle('DANGER'),
          );
        const embedss = new Discord.MessageEmbed()
          .setTitle(`${client.user.username} | Sistema de Compras`)
          .setDescription(`${emojis.carrinho} | **Produto:**
 \`\`${eprod.nome}\`\`

${emojis.money} | **quantidade:** 
 \`\`${quantidade1}\`\`

${emojis.dinheiro} | **valor total:** 
 \`\`${precoalt}\`\` 
 
 ${emojis.seguranca} | **id da compra:**
 \`\`${data_id}\`\` `)

          .setColor(config.get(`color`))
          .setThumbnail(client.user.displayAvatarURL())
        c.send({ embeds: [embedss], content: `<@${interaction.user.id}>`, components: [row], fetchReply: true }).then(msg => {
          const filter = i => i.user.id === interaction.user.id;
          const collector = msg.createMessageComponentCollector({ filter });
          collector.on("collect", intera => {
            intera.deferUpdate()
            if (intera.customId === 'cancelarbuy') {
              clearInterval(timer2);
              const embedcancelar = new Discord.MessageEmbed()
                .setTitle(`${emojis.carrinho} | **${client.user.username} Compra Cancelada com sucessso!!**`)
                .setDescription(`<:information:1069744387996782682> | VOCÊ CANCELOU A COMPRA, E TODOS OS PRODUTOS FORAM DEVOLVIDO PARA O ESTOQUE. VOCÊ PODE VOLTAR A COMPRAR QUANDO QUISER! caso queira mais informacoes de nosso bot [clique aqui](https://discord.gg/patrickstore)`)
                .setColor(config.get(`color`))
                .setThumbnail(client.user.displayAvatarURL())
              interaction.user.send({ embeds: [embedcancelar] })
              db3.delete(`${data_id}`)
              if ((interaction.guild.channels.cache.find(c => c.topic === interaction.user.id))) { c.delete(); }
            }
            if (intera.customId === "addboton") {
              if (quantidade1++ >= quantidade) {
                quantidade1--;
                const embedss2 = new Discord.MessageEmbed()
                  .setTitle(`${client.user.username} | Sistema de Compras`)
                  .setDescription(`${emojis.carrinho} | **Produto:**
 \`\`${eprod.nome}\`\`

${emojis.money} | **quantidade:** 
 \`\`${quantidade1}\`\`

${emojis.dinheiro} | **valor total:** 
 \`\`${precoalt}\`\` 
 
 ${emojis.seguranca} | **id da compra:**
 \`\`${data_id}\`\` `)
                  .setColor(config.get(`color`))
                  .setThumbnail(client.user.displayAvatarURL())
                msg.edit({ embeds: [embedss2] })
              } else {
                precoalt = Number(precoalt) + Number(eprod.preco);
                const embedss = new Discord.MessageEmbed()
                  .setTitle(`${client.user.username} | Sistema de Compras`)
                  .setDescription(`${emojis.carrinho} | **Produto:**
 \`\`${eprod.nome}\`\`

${emojis.money} | **quantidade:** 
 \`\`${quantidade1}\`\`

${emojis.dinheiro} | **valor total:** 
 \`\`${precoalt}\`\` 
 
 ${emojis.seguranca} | **id da compra:**
 \`\`${data_id}\`\` `)
                  .setColor(config.get(`color`))
                  .setThumbnail(client.user.displayAvatarURL())
                msg.edit({ embeds: [embedss] })
              }
            }
            if (intera.customId === "removeboton") {
              if (quantidade1 <= 1) {
              } else {
                precoalt = precoalt - eprod.preco;
                quantidade1--;
                const embedss = new Discord.MessageEmbed()
                  .setTitle(`${client.user.username} | Sistema de Compras`)
                  .setDescription(`${emojis.carrinho} | **Produto:**
 \`\`${eprod.nome}\`\`

${emojis.money} | **quantidade:** 
 \`\`${quantidade1}\`\`

${emojis.dinheiro} | **valor total:** 
 \`\`${precoalt}\`\` 
 
 ${emojis.seguranca} | **id da compra:**
 \`\`${data_id}\`\` `)
                  .setColor(config.get(`color`))
                  .setThumbnail(client.user.displayAvatarURL())
                msg.edit({ embeds: [embedss] })
              }
            }

            if (intera.customId === "comprarboton") {
              msg.channel.bulkDelete(50);
              clearInterval(timer2);
              const timer3 = setTimeout(function() {
                if ((interaction.guild.channels.cache.find(c => c.topic === interaction.user.id))) { c.delete(); }
                db3.delete(`${data_id}`)
              }, 300000)
              const row = new Discord.MessageActionRow()
                .addComponents(
                  new Discord.MessageButton()
                    .setCustomId('addcboton')
                    .setLabel('adicionar Cupom')
                    .setEmoji(emojis.cupom)
                    .setStyle('PRIMARY'),
                )
                .addComponents(
                  new Discord.MessageButton()
                    .setCustomId('continuarboton')
                    .setLabel('Continuar')
                    .setEmoji(emojis.carrinho)
                    .setStyle('SUCCESS'),
                )
                .addComponents(
                  new Discord.MessageButton()
                    .setCustomId('cancelarboton')
                    .setLabel('Cancelar')
                    .setEmoji(emojis.errado)
                    .setStyle('DANGER'),
                );

              const embedss = new Discord.MessageEmbed()
                .setTitle(`${client.user.username} | Sistema de Compras`)
                .setDescription(``)
                .addField(`${emojis.cupom} | **Cupom:**`, `$nenhum cupom inviado`)
                              .addField(`<:zz_ficha_cdw:1069743069206953984> | **Desconto:**`, `Sem desconto..`)
                              .addField(`${emojis.money} | **Preço Total:**`, `${precoalt} Reais`)

                .setColor(config.get(`color`))
                .setThumbnail(client.user.displayAvatarURL())
              c.send({ embeds: [embedss], components: [row], content: `<@${interaction.user.id}>`, fetchReply: true }).then(msg => {
                const filter = i => i.user.id === interaction.user.id;
                const collector = msg.createMessageComponentCollector({ filter });
                collector.on("collect", intera2 => {
                  intera2.deferUpdate()
                  if (intera2.customId === 'addcboton') {
                    intera.channel.permissionOverwrites.edit(intera.user.id, { SEND_MESSAGES: true });
                    msg.channel.send(`<a:loading:1049060806374985862> | ENVIE ABAIXO O CUPOM!`).then(mensagem => {
                      const filter = m => m.author.id === interaction.user.id;
                      const collector = mensagem.channel.createMessageCollector({ filter, max: 1 });
                      collector.on("collect", cupom => {
                        if (`${cupom}` !== `${dbc.get(`${cupom}.idcupom`)}`) {
                          cupom.delete()
                          mensagem.edit(`<:icons_Wrong:1069731513765199892> | ISSO NÃO E UM CUPOM`)
                          intera.channel.permissionOverwrites.edit(intera.user.id, { SEND_MESSAGES: false });
                          return;
                        }

                        var minalt = dbc.get(`${cupom}.minimo`);
                        var dscalt = dbc.get(`${cupom}.desconto`);
                        var qtdalt = dbc.get(`${cupom}.quantidade`);

                        precoalt = Number(precoalt) + Number(`1`);
                        minalt = Number(minalt) + Number(`1`);
                        if (precoalt < minalt) {
                          cupom.delete()
                          intera.channel.permissionOverwrites.edit(intera.user.id, { SEND_MESSAGES: false });
                          mensagem.edit(`<:icons_Wrong:1069731513765199892> | VOCÊ NÃO ATINGIU O MÍNIMO!`)
                          return;
                        } else {

                          precoalt = Number(precoalt) - Number(`1`);
                          minalt = Number(minalt) - Number(`1`);

                          if (`${dbc.get(`${cupom}.quantidade`)}` === "0") {
                            cupom.delete()
                            intera.channel.permissionOverwrites.edit(intera.user.id, { SEND_MESSAGES: false });
                            mensagem.edit(`<:icons_Wrong:1069731513765199892> | ESSE CUPOM NÃO ESTÁ MAIS DISPONÍVEL!!`)
                            return;
                          }

                          if (`${cupom}` === `${dbc.get(`${cupom}.idcupom`)}`) {
                            cupom.delete()
                            mensagem.edit(`${emojis.certo} | CUPOM ADICIONADO!!`)
                            intera.channel.permissionOverwrites.edit(intera.user.id, { SEND_MESSAGES: false });
                            var precinho = precoalt;
                            var descontinho = "0." + dscalt;
                            var cupomfinal = precinho * descontinho;
                            precoalt = precinho - cupomfinal;
                            qtdalt = qtdalt - 1;
                            row.components[0].setDisabled(true)
                            const embedss2 = new Discord.MessageEmbed()
                              .setTitle(`${client.user.username} | sistema de compras`)
                              .addField(`${emojis.cupom} | **Cupom:**`, `${dbc.get(`${cupom}.idcupom`)}`)
                              .addField(`<:zz_ficha_cdw:1069743069206953984> | **Desconto:**`, `${dbc.get(`${cupom}.desconto`)}.00%`)
                              .addField(`${emojis.money} | **Preço Total:**`, `${precoalt} Reais`)
                              .setColor(config.get(`color`))
                              .setThumbnail(client.user.displayAvatarURL())
                            msg.edit({ embeds: [embedss2], components: [row], content: `<@${interaction.user.id}>`, fetchReply: true })
                            dbc.set(`${cupom}.quantidade`, `${qtdalt}`)
                          }
                        }
                      })
                    })
                  }

                  if (intera2.customId === 'cancelarboton') {
                    clearInterval(timer3);
                    const embedcancelar2 = new Discord.MessageEmbed()
                    .setTitle(`${emojis.carrinho} | **${client.user.username} Compra Cancelada com sucessso!!**`)
                    .setDescription(`<a:loading:1049060806374985862> | VOCÊ CANCELOU A COMPRA, E TODOS OS PRODUTOS FORAM DEVOLVIDO PARA O ESTOQUE. VOCÊ PODE VOLTAR A COMPRAR QUANDO QUISER! caso queira mais informacoes de nosso bot [clique aqui](https://discord.gg/patrickstore)`)
                    .setColor(config.get(`color`))
                    .setThumbnail(client.user.displayAvatarURL())
              
                    interaction.user.send({ embeds: [embedcancelar2] })
                    db3.delete(`${data_id}`)
                    if ((interaction.guild.channels.cache.find(c => c.topic === interaction.user.id))) { c.delete(); }
                  }

                  if (intera2.customId === "continuarboton") {
                    msg.channel.bulkDelete(50);
                    clearInterval(timer3);
                    const venda = setTimeout(function() {
                      if ((interaction.guild.channels.cache.find(c => c.topic === interaction.user.id))) { c.delete(); }
                      db3.delete(`${data_id}`)
                    }, 1800000)
                    mercadopago.configurations.setAccessToken(config.get(`access_token`));
                    var payment_data = {
                      transaction_amount: Number(precoalt),
                      description: `Pagamento | ${interaction.user.username}`,
                      payment_method_id: 'pix',
                      payer: {
                        email: 'sixshop2022@gmail.com',
                        first_name: 'Heverson',
                        last_name: 'Bueno',
                        identification: {
                          type: 'CPF',
                          number: '75608669649'
                        },
                        address: {
                          zip_code: '06233200',
                          street_name: 'Av. das Nações Unidas',
                          street_number: '3003',
                          neighborhood: 'Bonfim',
                          city: 'Osasco',
                          federal_unit: 'SP'
                        }
                      }
                    };

                    mercadopago.payment.create(payment_data).then(function(data) {
                      db3.set(`${data_id}.status`, `Pendente (2)`)
                      const buffer = Buffer.from(data.body.point_of_interaction.transaction_data.qr_code_base64, "base64");
                      const attachment = new Discord.MessageAttachment(buffer, "payment.png");
                      const row = new Discord.MessageActionRow()
                        .addComponents(
                          new Discord.MessageButton()
                            .setCustomId('codigo')
                            .setEmoji(`<:PIX:1069748710021550121>`)
                            .setLabel("Copia e Cola")
                            .setStyle(`SECONDARY`),
                        )
                        .addComponents(
                          new Discord.MessageButton()
                            .setCustomId('qrcode')
                            .setEmoji(`<:qrcode:1049060944594092075>`)
                            .setLabel("QR Code")
                            .setStyle('SECONDARY'),
                        )
                        .addComponents(
                          new Discord.MessageButton()
                            .setCustomId('cancelarpix')
                            .setEmoji(emojis.errado)
                            .setLabel("Cancelar")
                            .setStyle('DANGER'),
                        );
                      const embed = new Discord.MessageEmbed()
                        .setTitle(`${client.user.username} | Sistema de Compras`)
                        .setDescription(`

${emojis.carrinho} | **Produto:**
\`\`${eprod.nome}\`\`

${emojis.money} | **quantidade:** 
\`\`${quantidade1}\`\`
 
${emojis.dinheiro} | **valor total:**
\`\`${precoalt}\`\`

${emojis.info} | **pagamento id:**
\`\`${data_id}\`\` `)
                        .setColor(config.get(`color`))
                        .setThumbnail(client.user.displayAvatarURL())
                      msg.channel.send({ embeds: [embed], content: `<@${interaction.user.id}>`, components: [row] }).then(msg => {

                        const collector = msg.channel.createMessageComponentCollector();
                        const lopp = setInterval(function() {
                          const time2 = setTimeout(function() {
                            clearInterval(lopp);
                          }, 1800000)
                          axios.get(`https://api.mercadolibre.com/collections/notifications/${data.body.id}`, {
                            headers: {
                              'Authorization': `Bearer ${config.get(`access_token`)}`
                            }
                          }).then(async (doc) => {
                            if (doc.data.collection.status === "approved") {
                              db3.set(`${data_id}.status`, `Processando`)
                            }

                            if (`${db3.get(`${data_id}.status`)}` === "Processando") {
                              clearTimeout(time2)
                              clearInterval(lopp);
                              clearInterval(venda);
                              const vendadel = setTimeout(function() {
                                if ((interaction.guild.channels.cache.find(c => c.topic === interaction.user.id))) { c.delete(); }
                              }, 60000)
                              const a = db.get(`${severi}.conta`);
                              const canalif1 = client.channels.cache.get(config.canallogs);
                              db2.add("pedidostotal", 1)
                              db2.add("gastostotal", Number(precoalt))
                              db2.add(`${moment().format('L')}.pedidos`, 1)
                              db2.add(`${moment().format('L')}.recebimentos`, Number(precoalt))
                              db2.add(`${interaction.user.id}.gastosaprovados`, Number(precoalt))
                              db2.add(`${interaction.user.id}.pedidosaprovados`, 1)

                              if (a < quantidade1) {
                                db3.set(`${data_id}.status`, `Reembolsado`)
                                msg.channel.send(`${emojis.certo} | pagamento reembolsado`)
                                msg.channel.send(`${emojis.certo} | ID Da compra: ${data_id}`)
                                mercadopago.configure({ access_token: `${config.get(`access_token`)}` });
                                var refund = { payment_id: `${data.body.id}` };
                                mercadopago.refund.create(refund).then(result => {
                                  const message2new = new Discord.MessageEmbed()
                                    .setTitle(`${client.user.username} | COMPRA REEMBOLSADA`)
                                  
                                    .addField(`<:carrinho:1049060716021301319> | COMPRADOR:`, `<@${data_id}>`)
                                    .addField(`<:cx2_user:1069740959543341057> | DATA DA COMPRA :`, `${moment().format('LLLL')}`)
                                    .addField(`<:carrinho:1049060716021301319> | NOME DO PRODUTO :`, `${eprod.nome}`)
                                    .addField(`<:caixa:1049060428069752915> | QUANTIDADE :`, `${quantidade1}x`)
                                    .addField(`<:Dinheiro:1051632142314131556> | PREÇO :`, `${precoalt}`)
                                    .addField(`<:information:1069744387996782682> | ID DA COMPRA :`, `\`\`\`${data_id}\`\`\``)
                                    .setColor(config.get(`color`))
                                    .setThumbnail(client.user.displayAvatarURL())
                                  canalif1.send({ embeds: [message2new] })
                                })
                              } else {
                                const removed = a.splice(0, Number(quantidade1));
                                db.set(`${severi}.conta`, a);
                                const embedentrega = new Discord.MessageEmbed()
                                  .setTitle(`${config.get(`title`)} | SEU PRODUTO`)
                                  .setDescription(`<a:a_black_world_tde:1064014436525936720> | PRODUTOS:** \n  \`\`\` 1º| ${removed.join("\n")}\`\`\`\n**<:information:1069744387996782682> | ID DA COMPRA:** ${data_id}\n\n**<a:estrela:1069749920115982458> | AVALIE A NOSSA LOJA [aqui](https://canary.discord.com/channels/1048404693799415870/1049065354107818087)`)
                                  .setColor(config.get(`color`))
                                  .setThumbnail(client.user.displayAvatarURL())
                                interaction.user.send({ embeds: [embedentrega] })
                                db3.set(`${data_id}.status`, `Concluido`)
                                msg.channel.send(`${emojis.certo} | **PAGAMENTO APROVADO VERIFIQUE A SUA DM!**`)
                                msg.channel.send(`${emojis.seguranca} | *ID DA COMPRA: ${data_id}*`)
                                msg.channel.send(`<:pin:1069750415110971402> | CARRINHO FECHAR EM 3 MINUTOS`)
                                const membro = interaction.guild.members.cache.get(interaction.user.id)
                                const role = interaction.guild.roles.cache.find(role => role.id === config.get(`role`))
                                membro.roles.add(role)

                                const rowavaliacao = new Discord.MessageActionRow()
                                  .addComponents(
                                    new Discord.MessageButton()
                                      .setCustomId('1star')
                                      .setEmoji('⭐')
                                      .setLabel('1')
                                      .setStyle('PRIMARY'),
                                  )
                                  .addComponents(
                                    new Discord.MessageButton()
                                      .setCustomId('2star')
                                      .setEmoji('⭐')
                                      .setLabel('2')
                                      .setStyle('PRIMARY'),
                                  )
                                  .addComponents(
                                    new Discord.MessageButton()
                                      .setCustomId('3star')
                                      .setEmoji('⭐')
                                      .setLabel('3')
                                      .setStyle('PRIMARY'),
                                  )
                                  .addComponents(
                                    new Discord.MessageButton()
                                      .setCustomId('4star')
                                      .setEmoji('⭐')
                                      .setLabel('4')
                                      .setStyle('PRIMARY'),
                                  )
                                  .addComponents(
                                    new Discord.MessageButton()
                                      .setCustomId('5star')
                                      .setEmoji('⭐')
                                      .setLabel('5')
                                      .setStyle('PRIMARY'),
                                  );

                                let sleep = async (ms) => await new Promise(r => setTimeout(r, ms));
                                let avaliacao = "Nenhuma avaliação enviada..."
                                const embed = await msg.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(`${client.user.username} | Sistema de Avaliação`)
                                    .setDescription("")
                                    .addField(`${emojis.mundo} | INFORMAÇÕES:`, `ESCOLHA UMA NOTA DESSA VENDA.`)
                                    .addField(`<a:loading:1049060806374985862> |`, `AGUARDANDO...`)
                                    .setFooter(`VOCÊ TEM 30 SEGUNDOS PARA AVALIAR...`)
                                    .setColor(config.get(`color`))], components: [rowavaliacao]
                                })
                                const interacaoavaliar = embed.createMessageComponentCollector({ componentType: "BUTTON", });
                                interacaoavaliar.on("collect", async (interaction) => {
                                  if (interaction.user.id != interaction.user.id) {
                                    return;
                                  }

                                  if (interaction.isButton()) {
                                    var textoest = ""
                                    var estrelas = interaction.customId.replace("star", "")

                                    for (let i = 0; i != estrelas; i++) {
                                      textoest = `${textoest} ⭐`
                                    }

                                    interaction.deferUpdate()
                                    embed.reply(`${emojis.certo} | OBRIGADO POR SUA AVALIAÇÃO`).then(msg => {
                                      rowavaliacao.components[0].setDisabled(true)
                                      rowavaliacao.components[1].setDisabled(true)
                                      rowavaliacao.components[2].setDisabled(true)
                                      rowavaliacao.components[3].setDisabled(true)
                                      rowavaliacao.components[4].setDisabled(true)

                                      const embednew = new Discord.MessageEmbed()
                                        .setTitle(`${client.user.username} | Sistema de Avaliação`)
                                        .setDescription("")
                                        .addField(`${emojis.mundo} | INFORMAÇÕES:`, `Escolha uma nota essa venda.`)
                                        .addField(`${emojis.estrela} | Estrelas:`, `${textoest} (${estrelas})`)
                                        .setColor(config.get(`color`))
                                      embed.edit({ embeds: [embednew], components: [rowavaliacao] })
                                      avaliacao = `${textoest} (${estrelas})`

                                      interaction.channel.send({ embeds: [embed] })
                                      const embedaprovadolog = new Discord.MessageEmbed()
                                        .setTitle(`${client.user.username} | Nova compra`)
                                        .setDescription(`<:cx2_user:1069740959543341057> | **USUÁRIO:**
${interaction.user.tag}     
                               
<:carrinho:1049060716021301319> | **PRODUTO:**
${eprod.nome}    
                                 
 <:Dinheiro:1051632142314131556> | **VALOR TOTAL:**
R$${precoalt}                                     

<:information:1069744387996782682> | **ID DA COMPRA:**
${data.body.id}

<a:estrela:1069749920115982458> | **AVALIAÇÃO:**
${avaliacao}   
                                                                         <:cx2_user:1069740959543341057> | **DATA DA COMPRA :**
${moment().format('LLLL')}
                                        
                                        
                                        `)
                                        .setColor(config.get(`color`))
                                        .setThumbnail(client.user.displayAvatarURL())
                                      client.channels.cache.get(config.get(`logs`)).send({ embeds: [embedaprovadolog] })
                                      db3.set(`${data_id}.entrid`, `${removed.join(" \n")}`)

                                    })
                                  }
                                })

                                const row = new Discord.MessageActionRow()
                                  .addComponents(
                                    new Discord.MessageButton()
                                      .setCustomId('reembolso')
                                      .setEmoji(`<:apertodemao:1069745307887353967>`)
                                      .setLabel('Reembolsar')
                                      .setStyle('DANGER'),
                                  );

                                const canalif = client.channels.cache.get(config.get(`logs_staff`))
                                const message2 = await canalif.send({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(`${client.user.username} | Compra Aprovada`)
                                    .setDescriptoin(`${emojis.carinho} | **produto:**
                                    \`\`\`${removed.join(" \n")}\`\`\`

                                    **Nome produto:**
                                    ${eprod.nome}
                                    
                                    **Comprador:**
                                    ${interaction.user}

                                    ${emojis.mundo} | **horário:**
                                    ${moment().format('LLLL')}
                                    

                                           `)
                                   
                                    .setColor(config.get(`color`))
                                    .setThumbnail(client.user.displayAvatarURL())], components: [row]
                                })
                                const interação = message2.createMessageComponentCollector({ componentType: "BUTTON", })
                                interação.on("collect", async (interaction) => {
                                  if (interaction.customId === "reembolso") {
                                    const user = interaction.user.id
                                    if (interaction.user.id !== `${perms.get(`${user}_id`)}`) return interaction.reply({ content: ' | Você não está na lista de pessoas!', ephemeral: true })
                                    interaction.deferUpdate()
                                    mercadopago.configure({ access_token: `${config.get(`access_token`)}` });
                                    var refund = { payment_id: `${data.body.id}` };
                                    mercadopago.refund.create(refund).then(result => {
                                      db3.set(`${data_id}.status`, `Reembolsado`)
                                      message2.delete()
                                      const message2new = new Discord.MessageEmbed()
                                        .setTitle(`${config.get(`title`)} | Compra Reembolsada`)
                                        .setDescriptoin(`${emojis.carinho} | **produto:**
                                        \`\`\`${removed.join(" \n")}\`\`\`
    
                                        **Nome produto:**
                                        ${eprod.nome}
                                        
                                        **Horario:**
                                       
    
                                        **Comprador:**
                                        ${interaction.user}
    
    
    
                                               `)
                                       
                                        .setColor(config.get(`color`))
                                        .setThumbnail(client.user.displayAvatarURL())
                                      canalif.send({ embeds: [message2new] })
                                    }).catch(function(error) { interaction.followUp({ content: '<:error:1069750943417122846> | Houve algum erro durante a transação, tente novamente!', ephemeral: true }) });
                                  }
                                })

                                const row2 = new Discord.MessageActionRow()
                                  .addComponents(
                                    new Discord.MessageButton()
                                      .setCustomId(interaction.customId)
                                      .setLabel('Comprar')
                                      .setEmoji(emojis.carrinho)
                                      .setStyle(`PRIMARY`),
                                  );

                                const embed2 = new Discord.MessageEmbed()
                                  .setTitle(`${config.get(`title`)} | Bot Store`)
                                  .setDescription(`
\`\`\`
${db.get(`${interaction.customId}.desc`)}
\`\`\`
**<a:a_black_world_tde:1064014436525936720> | Nome:** __${db.get(`${interaction.customId}.nome`)}__
**<:Dinheiro:1051632142314131556> | Preço:** __${db.get(`${interaction.customId}.preco`)}__
**<:caixa:1049060428069752915> | Estoque:** __${db.get(`${interaction.customId}.conta`).length}__`)
                                  .setColor(config.get(`color`))
                                  .setThumbnail(client.user.displayAvatarURL())
                                interaction.message.edit({ embeds: [embed2], components: [row2] })
                              }
                            }
                          })
                        }, 10000)

                        collector.on("collect", interaction => {
                          if (interaction.customId === 'codigo') {
                            row.components[0].setDisabled(true)
                            interaction.reply(data.body.point_of_interaction.transaction_data.qr_code)
                            const embed = new Discord.MessageEmbed()
                              .setTitle(`${config.get(`title`)} | Sistema de Compras`)
                              .setDescription(`
\`\`\`
Pague para receber o produto.
\`\`\``)
                              .addField(`<a:a_black_world_tde:1064014436525936720> | Nome:`, `${eprod.nome}`)
                              .addField(`<:caixa:1049060428069752915> | Quantidade:`, `${quantidade1}`)
                              .addField(`<:caixa:1049060428069752915> | Valor`, `${precoalt} Reais`)
                              .addField(`<:information:1069744387996782682> | Id da compra`, `${data_id}`)
                              .setColor(config.get(`color`))
                              .setThumbnail(client.user.displayAvatarURL())
                            msg.edit({ embeds: [embed], content: `<@${interaction.user.id}>`, components: [row] })
                          }

                          if (interaction.customId === 'qrcode') {
                            row.components[1].setDisabled(true)
                            const embed2 = new Discord.MessageEmbed()
                              .setTitle(`${config.get(`title`)} | Sistema de Compras`)
                              .setDescription(`
\`\`\`
Pague para receber o produto.
\`\`\``)
                              .addField(`<a:a_black_world_tde:1064014436525936720> | Nome:`, `${eprod.nome}`)
                              .addField(`<:caixa:1049060428069752915> | Quantidade:`, `${quantidade1}`)
                              .addField(`<:Dinheiro:1051632142314131556> | Valor`, `${precoalt} Reais`)
                              .addField(`<:information:1069744387996782682> | Id da compra`, `${data_id}`)
                              .setColor(config.get(`color`))
                              .setThumbnail(client.user.displayAvatarURL())
                            msg.edit({ embeds: [embed2], content: `<@${interaction.user.id}>`, components: [row] })

                            const embed = new Discord.MessageEmbed()
                              .setTitle(`${client.user.username} | QR Code`)
                              .setDescription(`Aponte a camera do seu dispositivo para o qrcode e escaneio-o`)
                              .setImage("attachment://payment.png")
                              .setColor(config.get(`color`))
                            interaction.reply({ embeds: [embed], files: [attachment] })
                          }

                          if (interaction.customId === 'cancelarpix') {
                            clearInterval(lopp);
                            clearInterval(venda)
                            const embedcancelar3 = new Discord.MessageEmbed()
                              .setTitle(`${config.get(`title`)} | Compra Cancelada`)
                              .setDescription(`<:icons_Wrong:1069731513765199892> | VOCÊ CANCELOU A COMPRA, E TODOS OS PRODUTOS FORAM DEVOLVIDO PARA O ESTOQUE. VOCÊ PODE VOLTAR A COMPRAR QUANDO QUISER!`)
                              .setColor(config.get(`color`))
                              .setThumbnail(client.user.displayAvatarURL())
                            interaction.user.send({ embeds: [embedcancelar3] })
                            db3.delete(`${data_id}`)
                            if ((interaction.guild.channels.cache.find(c => c.topic === interaction.user.id))) { c.delete(); }
                          }
                        })
                      })
                    }).catch(function(error) {
                      console.log(error)
                    });
                  }
                })
              })
            }
          })
        })
      })
    }
  }
})


client.on("messageCreate", message => {

  if (message.author.bot) return;
  if (message.channel.type == '')
    return
  if (message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`) {
    let embed = new Discord.MessageEmbed()
      .setColor(config.color)
      .setDescription(` Olá, tudo bem? me chamo ${client.user.username} e fui desenvolvido para fazer vendas 100% automaticas, ajudando a vida de vendedores aqui no discord
      
      ${emojis.dinheiro} | **para ver meus comandos use .ajuda**
      ${emojis.carrinho} | **para entrar no meu** [clique aqui](https://discord.gg/patrickstore)`)
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter('todos direitos reservado a Patrick Store')
      
    message.reply({ embeds: [embed] })
  }
});