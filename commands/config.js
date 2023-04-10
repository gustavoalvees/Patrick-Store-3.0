const Discord = require("discord.js")
const emojis = require("../emojis.json")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db = new JsonDatabase({ databasePath:"./databases/myJsonProdutos.json" });

module.exports = {
    name: "config", 
    run: async(client, message, args) => {
        if(message.author.id !== `${perms.get(`${message.author.id}_id`)}`) return message.reply(`<:icons_Wrong:1069731513765199892> | Você não está na lista de pessoas!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
        if(!args[0]) return message.reply(`<:icons_Wrong:1069731513765199892> | Você não selecionou nenhum ID!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
        if(args[1]) return message.reply(`<:icons_Wrong:1069731513765199892> | Você não pode selecionar dois IDs de uma vez!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
        if(args[0] !== `${db.get(`${args[0]}.idproduto`)}`) return message.reply(`<:icons_Wrong:1069731513765199892> | Esse ID de produto não é existente!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
        
        const adb = args[0];
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('descgerenciar')
                    .setEmoji(`<:ticketlog:1069762009433907310>`)
                    .setLabel('Descrição')
                    .setStyle("PRIMARY"),
            )
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('nomegerenciar')
                    .setEmoji(`<a:a_black_world_tde:1064014436525936720>`)
                    .setLabel('Nome')
                    .setStyle('PRIMARY'),
            )
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('precogerenciar')
                    .setEmoji(`<:Dinheiro:1051632142314131556>`)
                    .setLabel('Preço')
                      .setStyle('PRIMARY'),
            )
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('deletegerenciar')
                    .setEmoji(`<:cx2_apagado:1069767687368093796>`)
                    .setLabel('Excluir')
                    .setStyle('DANGER'),
            )
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('rlgerenciar')
                    .setEmoji(`<:cx2_atualizado:1069739526504857780>`)
                    .setLabel('Atualizar')
                    .setStyle('PRIMARY'),
            );
        
        const embednew = await message.reply({ embeds: [new Discord.MessageEmbed()
            .setTitle(`${config.get(`title`)} | Configurando o(a) ${adb}`)
            .setDescription(`
<:ticketlog:1069762009433907310> | Descrição: \`\`\` ${db.get(`${adb}.desc`)}\`\`\`
<a:a_black_world_tde:1064014436525936720> | Nome: ${db.get(`${adb}.nome`)}
<:Dinheiro:1051632142314131556> | Preço: ${db.get(`${adb}.preco`)} Reais
<:caixa:1049060428069752915> | Estoque: ${db.get(`${adb}.conta`).length}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(config.get(`color`))], components: [row]})
        
            const interação = embednew.createMessageComponentCollector({
               componentType: "BUTTON",
            })
  
            interação.on("collect", async (interaction) => {
               if (message.author.id != interaction.user.id) {
               return;
            }
                
                if (interaction.customId === "deletegerenciar") {
                    message.delete()
                    message.channel.send("<:icons_Correct:1069731471448875049> | Excluido!")
                    db.delete(adb)
                }
                if (interaction.customId === "precogerenciar") {
                   interaction.deferUpdate();
                    message.channel.send(`${emojis.mundo} |  envie abaixo o novo preço!!`).then(message => {
                  
                        const filter = m => m.author.id === interaction.user.id;
                        const collector = message.channel.createMessageCollector({ filter, max: 1 });
                        collector.on("collect", message => {
                           message.delete()
                          db.set(`${adb}.preco`, `${message.content.replace(",", ".")}`)
                            message.edit("<:icons_Correct:1069731471448875049> | Alterado!")
              
                         
                             message.channel.send("<:icons_Correct:1069731471448875049> | Atualizado!")
                          })
                        })
                      }
                if (interaction.customId === "nomegerenciar") {
        interaction.deferUpdate();
                    message.channel.send("❓ | Qual o novo nome?").then(msg => {
                        const filter = m => m.author.id === interaction.user.id;
                        const collector = msg.channel.createMessageCollector({ filter, max: 1 });
                        collector.on("collect", message => {
                            message.delete()
                            db.set(`${adb}.nome`, `${message.content}`)
                            msg.edit("<:icons_Correct:1069731471448875049> | Alterado!")
                        })
                    })
                }
    if (interaction.customId === 'descgerenciar') {
        interaction.deferUpdate();
                    message.channel.send("❓ | Qual a nova descrição?").then(msg => {
                        const filter = m => m.author.id === interaction.user.id;
                        const collector = msg.channel.createMessageCollector({ filter, max: 1 });
                        collector.on("collect", message => {
                            message.delete()
                            db.set(`${adb}.desc`, `${message.content}`)
                            msg.edit("<:icons_Correct:1069731471448875049> | Alterado!")
                        })
                    })
                }
    if (interaction.customId === 'rlgerenciar') {
        interaction.deferUpdate();
         const embed = new Discord.MessageEmbed()
           .setTitle(`${config.get(`title`)} | Configurando o(a) ${adb}`)
           .setDescription(`
<:ticketlog:1069762009433907310> | Descrição: \`\`\` ${db.get(`${adb}.desc`)}\`\`\`
<a:a_black_world_tde:1064014436525936720> | Nome: ${db.get(`${adb}.nome`)}
<:Dinheiro:1051632142314131556> | Preço: ${db.get(`${adb}.preco`)} Reais
<:caixa:1049060428069752915> | Estoque: ${db.get(`${adb}.conta`).length}`)
           .setThumbnail(client.user.displayAvatarURL())
           .setColor(config.get(`color`))
           message.edit({ embeds: [embed] })
           message.channel.send("<:icons_Correct:1069731471448875049> | Atualizado!")
                }
              })
            }
           }