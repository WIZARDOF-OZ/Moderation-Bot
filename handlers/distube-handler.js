const Distube = require("distube");
const config = require("../config")
const ee = require("../embed_Config.json");
const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js")
const { format } = require("../function.js")
const client = new Discord.Client();
module.exports = (client) => {

 client.distube = new Distube(client,{
   
 })

  // Queue status template
  const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

  // DisTube event listeners, more in the documentation page
  client.distube
      .on("playSong", (message, queue, song) => message.channel.send(new MessageEmbed()
        .setTitle("Playing :notes: " + song.name)
        .setURL(song.url)
        .setColor(ee.color)
        .addField("Duration", `\`${song.formattedDuration}\``)
        .addField("QueueStatus", status(queue))
        .setThumbnail(song.thumbnail)
        .setFooter(`Requested by: ${song.user.tag}`, song.user.displayAvatarURL({dynamic: true}))
        )
      )
      .on("addSong", (message, queue, song) => message.channel.send(new MessageEmbed()
          .setTitle("Added :thumbsup: " + song.name)
          .setURL(song.url)
          .setColor(ee.color)
          .addField(`${queue.songs.length} Songs in the Queue`, `Duration: \`${format(queue.duration*1000)}\``)
          .addField("Duration", `\`${song.formattedDuration}\``)
          .setThumbnail(song.thumbnail)
          .setFooter(`Requested by: ${song.user.tag}`, song.user.displayAvatarURL({dynamic: true}))
        )
      )
      .on("playList", (message, queue, playlist, song) => message.channel.send(new MessageEmbed()
            .setTitle("Playing Playlist :notes: " + playlist.name + ` - \`[${playlist.songs.length} songs]\``)
            .setURL(playlist.url)
            .setColor(ee.color)
            .addField("Current Track: ", `[${song.name}](${song.url})`)
            .addField("Duration", `\`${playlist.formattedDuration}\``)
            .addField(`${queue.songs.length} Songs in the Queue`, `Duration: \`${format(queue.duration*1000)}\``)
            .setThumbnail(playlist.thumbnail.url)
            .setFooter(`Requested by: ${song.user.tag}`, song.user.displayAvatarURL({dynamic: true}))
        )
      )
      .on("addList", (message, queue, playlist) => message.channel.send(new MessageEmbed()
            .setTitle("Added Playlist :thumbsup: " + playlist.name + ` - \`[${playlist.songs.length} songs]\``)
            .setURL(playlist.url)
            .setColor(ee.color)
            .addField("Duration", `\`${playlist.formattedDuration}\``)
            .addField(`${queue.songs.length} Songs in the Queue`, `Duration: \`${format(queue.duration*1000)}\``)
            .setThumbnail(playlist.thumbnail.url)
            .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
        )
      )
      .on("searchResult", (message, result) =>
          message.channel.send(new MessageEmbed()
                  .setTitle("**Choose an option from below**")
                  .setURL(song.url)
                  .setColor(ee.color)
                  .setDescription(`${result.map((song, i) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n\n*Enter anything else or wait 60 seconds to cancel*`)
                  .setFooter(ee.footertext,ee.footericon)
          )
      )
      .on("searchCancel", (message) => message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`❌ ERROR | Search Cancelled`)
        )
      )
      .on("error", (message, e) => {
          console.log(String(e.stack).bgRed)
          message.channel.send(new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`❌ ERROR | An error occurred`)
              .setDescription(`\`\`\`${e.stack}\`\`\``)
          )
      })
      .on("initQueue", queue => {
          queue.autoplay = false;
          queue.volume = 100;
          queue.filter = "clear";
      }
    )

}