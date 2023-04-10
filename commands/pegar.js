const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const db3 = new JsonDatabase({ databasePath:"./databases/myJsonIDs.json" });
const config = new JsonDatabase({ databasePath:"./config.json" });

module.exports = {
    name: "info",
    run: async(client, message, args) => {
      const embederro2 = new Discord.MessageEmbed()
      if (message.author.id !== config.get(`owner`)) return message.reply(`<:error:1069750943417122846> | Apenas o dono do bot pode usar isso!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      if (!args[0]) return message.reply(`<:error:1069750943417122846> | Você não selecionou nenhum ID de compra!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      if(args[0] !== `${db3.get(`${args[0]}.id`)}`) return message.reply(`<:error:1069750943417122846> | Esse ID de compra não é existente!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
        
      const id = args[0]
      const embed = new Discord.MessageEmbed()
        .setTitle(`${config.get(`title`)} | Compra Aprovada`)
        .addField(`<:desc:1046917763630899301> | ID Da compra:`, `${db3.get(`${args[0]}.id`)}`)
        .addField(`<:as_ping:1046918282680209559> | Status:`, `${db3.get(`${args[0]}.status`)}`)
        .addField(`<:pag:1047172793403441183> | Comprador:`, `<@${db3.get(`${args[0]}.userid`)}>`)
        .addField(`<:IDD:1046918420093993121> | Id Comprador:`, `${db3.get(`${args[0]}.userid`)}`)
        .addField(`📅 | Data da compra:`, `${db3.get(`${args[0]}.dataid`)}`)
        .addField(`<a:planeta:1046916868394467348> | Produto:`, `${db3.get(`${args[0]}.nomeid`)}`)
        .addField(`<:DS_caixa:1046918501278961674> | Quantidade:`, `${db3.get(`${args[0]}.qtdid`)}`)
        .addField(`<:Dinheiro:1046918460279632023> | Preço:`, `${db3.get(`${args[0]}.precoid`)}`)
        .addField(`<:DS_caixa:1046918501278961674> | Produto entregue:`, `\`\`\`${db3.get(`${args[0]}.entrid`)}\`\`\``)
        .setColor(config.get(`color`))
      message.reply({embeds: [embed], content: "<a:certo1:1046918035367268422> | Encontrado!"})
    }
}