const Discord = require("discord.js")
const emojis = require("../emojis.json")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const db = new JsonDatabase({ databasePath:"myJsongifs.json" });


module.exports = {
    name: "resgatar", 
    run: async(client, message, args) => {
      
      if(!args[0]) return message.reply(`${emojis.errado} | envie um gift ao lado!!`)
      if(args[1]) return message.reply(`${emojis.errado} | resgate um gift por vez!!`)
      if(args[0] !== `${db.get(`${args[0]}.idgift`)}`) return message.reply(`${emojis.errado} | gift invalido!!`)
      if(`${db.get(`${args[0]}.status`)}` == `Resgatado`) return message.reply(`${emojis.errado} | o gift ja foi resgatado`)
      var texto = ""
      var quant = 1
      var estoque = `${db.get(`${args[0]}.estoque`)}`.split(',');
            
      for(let i in estoque) {
        texto = `${texto}${quant}° | ${estoque[i]}\n`
        quant++
      }
      
      db.set(`${args[0]}.status`, `Resgatado`)
      db.delete(`${args[0]}.estoque`)
      message.reply(`${emojis.certo} | resgtado com sucesso!!`)
      const embed = new Discord.MessageEmbed()
          .setTitle(`${config.get(`title`)} | Gift Resgtado`)
          .addField(`${emojis.info} Presentes:`, `\`\`\`${texto}\`\`\``)
          .addField(`${emojis.seguranca} Código:`, `${args[0]}`)
        
        
  .setThumbnail(client.user.displayAvatarURL())      
        
          .setColor(config.get(`color`))
      message.author.send({embeds: [embed]})
    }
  }      