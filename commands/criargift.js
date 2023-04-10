const Discord = require("discord.js")
const emojis = require("../emojis.json")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db = new JsonDatabase({ databasePath:"myJsongifs.json" });

module.exports = {
    name: "criar", 
    run: async(client, message, args) => {
     if(message.author.id !== `${perms.get(`${message.author.id}_id`)}`) return message.reply(`❌ | **Você não está na lista de pessoas!**`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
       function codigo() {
        var gerados = "";
        var codigos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
         for (var i = 0; i < 12; i++)
           gerados += codigos.charAt(Math.floor(Math.random() * codigos.length));
         return gerados;
       }
        
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('concluir')
            .setEmoji(emojis.certo)
            .setLabel('Continuar')
            .setStyle('SUCCESS'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('cancelar')
            .setEmoji(emojis.errado)
            .setLabel('Cancelar')
            .setStyle('DANGER'),
        );
        
        const gerado = codigo()        
        const embed = await message.reply({ embeds: [new Discord.MessageEmbed()
          .setTitle(`Bot store | Criação de Gift Card`)
          .addField(`${emojis.info} | **Presentes:**`, `*Nenhum...*`)
                                                     
          .addField(`${emojis.segurança} | **Código:**`, `*${gerado}*`)
                                                     .setThumbnail(client.user.displayAvatarURL())
         .setColor(config.get(`color`))], components: [row]})
        
        const interação = embed.createMessageComponentCollector({ componentType: "BUTTON", });
          interação.on("collect", async (interaction) => {
           if (message.author.id != interaction.user.id) {
             return;
           }

           if (interaction.customId === "concluir") {
             interaction.deferUpdate()
             const idcodigo = gerado
              db.set(`${idcodigo}.idgift`, `${idcodigo}`)
              db.set(`${idcodigo}.status`, `Disponivel`)
              db.push(`${idcodigo}.estoque`, `${idcodigo}`)
              const a = db.get(`${idcodigo}.estoque`);
              const removed = a.splice(0, 1);
              db.set(`${idcodigo}.estoque`, a);
               
             message.channel.send(`${emojis.mundo} | envie abaixo qual sera o produto!!`).then(msg => {
             const filter = m => m.author.id === interaction.user.id;
             const collector = msg.channel.createMessageCollector({ filter, max: 1 });
             collector.on("collect", message => {
               collector.stop();
               message.delete()
               var estoque = message.content.split('\n');            
               for (let i = 0; i != estoque.length; i++) {
                 db.push(`${idcodigo}.estoque`, `${estoque[i]}`)

                 if(i + 1 === estoque.length) {
                   var texto = ""
                   var quant = 1
                   var estoque = `${db.get(`${idcodigo}.estoque`)}`.split(',');
            
                   for(let i in estoque) {
                     texto = `${texto}${quant}° | ${estoque[i]}\n`
                     quant++
                   }
                     
                   row.components[0].setDisabled(true)
                   row.components[1].setDisabled(true)
                   msg.edit(`${emojis.certo} | Gift \`${gerado}\`\ Criado com sucesso!`)
                   const embednew = new Discord.MessageEmbed()
                    .setTitle(`Bot store | Criação de Gift Card`)
          .addField(`${emojis.info} | **Presentes:**`, `${texto}`)
                                                     
          .addField(`${emojis.seguranca} | **Código:**`, `*${gerado}*`)
                                                     .setThumbnail(client.user.displayAvatarURL())
                     .setColor(config.get(`color`))
                   embed.edit({ embeds: [embednew], components: [row] })
                 }
               }
             })
           })
         }
        
           if (interaction.customId === "cancelar") {
             embed.delete()
             message.channel.send(`<:error:1054109017674371072> | Cancelado...`)
           }
         })
       }
     };