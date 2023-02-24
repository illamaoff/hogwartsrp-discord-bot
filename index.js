const Discord = require('discord.js');
const client =  new Discord.Client({intents: 3276799});
const { ChannelType, PermissionsBitField, MessageEmbed, Client, IntentsBitField } = require('discord.js');
const prefix = '!';
const supportRoles = ['1078319887711219822'];

let ticketChannels = [];

client.on('messageCreate', message => {
/////////////// Création du salon ticket en fonction du nom de l'utilisateur ////////////////
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (command === 'openticket') {
    // Vérifiez si le message a été envoyé dans un salon de ticket
    if (ticketChannels.includes(message.channel.id)) return;

    // Créez un nouveau salon de ticket
    message.guild.channels.create({
      name: `ticket-${message.author.username}`,
      type: ChannelType.GUILD_TEXT,
      permissionOverwrites: [
        {
          id: message.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: message.author.id,
          allow: [PermissionsBitField.Flags.ViewChannel]
        },
        ...supportRoles.map(roleId => ({
          id: roleId,
          allow: [PermissionsBitField.Flags.ViewChannel]
        }))
      ]
    })
/////////////// Envoie de l'embed ans le salon ticket ////////////////
      .then(channel => {
        ticketChannels.push(channel.id);
        const ticketmsg = new Discord.EmbedBuilder()
        .setColor(0)
        .setTitle('```HogwartsRP```')
        .setURL('https://discord.js.org/')
        .setAuthor({ name: 'Besoin d\'un support', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        .setDescription('Vous nous avez sollicité pour de l\'aide. Sachez que nos différentes équipes font tout leur possible pour vous répondre dans des délais minimes. \n```               ```\n**Il vous suffit de réagir avec ❌ pour fermer ce ticket, une conffirmation vous sera demandée.**')
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addFields({ name: ' ', value: ' ', inline: false })
        .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter({ text: ' ', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        channel.send({ embeds: [ticketmsg] })
        .then(msg=> {
          msg.react('❌')
          msg.pin()
              .then(() => console.log('Message épinglé avec succès'))
              .catch(console.error);
                        const filter2 = (reaction, user) => {
                        // Ne prendre en compte que les réactions provenant de l'auteur du message initial
                        return ['❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                      };
                      
                      // Attendre une réponse de l'auteur du message initial
                      msg.awaitReactions({filter: filter2, max: 1, time: 10000, })
                        .then(collected => {
                          const reaction = collected.first();
                          // Si l'auteur a confirmé la suppression, supprimer le canal de ticket
                          if (reaction && reaction.emoji && reaction.emoji.name === '❌') {
                            channel.delete();
                          }
                        })
        })
      })
      .catch(console.error);
  }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                                                           //                            
//                                                                                                                                                                           //
///////////////////////////////////////////////////////////////////////////// COMMANDE /CLEAR /////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                                                           //
//                                                                                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  else if (command === 'clear' && !isNaN(args[0])) {
    const amount = parseInt(args[0]);
  
    if (amount < 1 || amount > 100) {
      return message.channel.send('Veuillez entrer un nombre entre 1 et 100 pour le nombre de messages à supprimer.');
    }
  
    message.channel.bulkDelete(amount, true)
      .then(deletedMessages => {
        message.channel.send(`**${deletedMessages.size}** messages ont été supprimés.`);
      })
      .catch(error => {
        console.error(error);
        message.channel.send('Une erreur est survenue lors de la suppression des messages.');
      });
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                                                           //                            
//                                                                                                                                                                           //
///////////////////////////////////////////////////////////////////////////// COMMANDE /EMBED /////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                                                           //
//                                                                                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.on('messageCreate', message => {
  if (message.content === '!embed') {
    const embed = new Discord.EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Some title')
    .setURL('https://discord.js.org/')
    .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
    .setDescription('Some description here')
    .setThumbnail('https://i.imgur.com/AfFp7pu.png')
    .addFields(
      { name: 'Regular field title', value: 'Some value here' },
      { name: '\u200B', value: '\u200B' },
      { name: 'Inline field title', value: 'Some value here', inline: true },
      { name: 'Inline field title', value: 'Some value here', inline: true },
    )
    .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    .setImage('https://i.imgur.com/AfFp7pu.png')
    .setTimestamp()
    .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
    message.channel.send({ embeds: [embed] });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                                                           //                            
//                                                                                                                                                                           //
///////////////////////////////////////////////////////////////////////////// PARTIE CLIENT ///////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                                                           //
//                                                                                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login('');