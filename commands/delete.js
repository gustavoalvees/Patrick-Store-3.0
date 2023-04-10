const Discord = require('discord.js')
module.exports = {
    name: 'fechar',
    description: '[👑 - Admin] Limpe as mensagens de um chat. 🔴',
    type: 'CHAT_INPUT',
    run: async (client, interaction, args) => {

        let numero = 50 + 49

        if (!interaction.member.permissions.has("MANAGE_CHANELA")) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando. 🔴`, ephemeral: true })
        } else


            if (parseInt(numero) > 99 || parseInt(numero) <= 0) {

            } else {

                setTimeout( () => {

                    try {
    
                    interaction.channel.delete()
    
                    }
                    catch (er) 
                    {
                        console.log(er)
                    }
    
                }, 5000)


                let embed = new Discord.MessageEmbed()
                    .setDescription(`canal fechado`)
                    .setTimestamp()
                interaction.reply({ embeds: [embed], ephemeral: true })
            }
        }
}