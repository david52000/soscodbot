const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const PREFIX = "s.";
const queue = new Map();
const EVERYONE = "@";

var client = new Discord.Client();

var bot = new Discord.Client();

var servers = {};

function play(connection, message) {
 var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
     if (server.queue[0]) play(connection, message);
     else connection.disconnect();
    });
}

bot.on("ready", function() {
    bot.user.setGame("SOS-BOT, s.help");
    console.log("Le Bot SOS-BOT est connecté")
});

bot.on("guildMemberAdd", function(member) {
    let role = member.guild.roles.find("name", "🎮 | Membre");
    member.guild.channels.find("name", "tchat-general").sendMessage(member.toString() + " Bienvenue sur le Discord, installe toi tranquillement ! ");
    member.addRole(role);
});

bot.on("guildMemberRemove", function(member) {
    member.guild.channels.find("name", "tchat-general").sendMessage(member.toString() + " Dommage, il est parti, bye ! " + member.toString() );
});

bot.on("message", async function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split (" ");

    var args2 = message.content.split(" ").slice(1);

    var suffix = args2.join(" ");

    var reason = args2.slice(1).join(" ");
    
    var reasontimed = args2.slice(2).join(' ')

    var user = message.mentions.users.first();
    
    var guild = message.guild;
    
    var member = message.member;
    
    var modlog = member.guild.channels.find("name", "logs")
    
    var user = message.mentions.users.first();

    switch (args[0].toLowerCase()) {
        case "play":
            if (!args[1]) {
             message.channel.sendMessage("[`Assisants Musique`] - Vous devez mettre un lien.");   
             return;
            }
            if(!message.member.voiceChannel) {
             message.channel.sendMessage("[`Assisants Musique`] - Vous devez être dans un salon vocal.");   
             return;
            }
            
            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };
            
            var server = servers[message.guild.id];
      
            server.queue.push(args[1]);
            
            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
               play(connection, message) 
            });
        break;    

        

        case "stop":
             if(!message.member.voiceChannel) {
             message.channel.sendMessage("[`Assisants Musique`] - Vous devez être dans un **salon vocal**.");   
             return;
            }
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
        break;

        case "help":
            var embed = new Discord.RichEmbed()
                .addField("s.ping", "C'est pour savoir mon ping en ce moment")
                .addField("s.play", "Jouer une musique !  Pour l'utiliser, faites .play (lien) !")
                .addField("s.stop", "Arreter la musique  Pour l'utiliser, faites .stop !")
                .addField("s.membres", "Permet de savoir le nombre de personnes sur le Discord")
                .addField("s.traductionhelp", "Pour afficher le Panel d'Aide de Traduction") 
                .addField("s.google", "Faite cette commande + (la recherche que vous souhaitez faire) !")
                .addField("s.youtube", "Faite cette commande + (la recherche que vous souhaitez faire)")
                .setColor("#cc6600")
                .setFooter("Idée de commandes ? Proposez des commandes à Quentinium en MP ! PS : Merci à Illian pour l'idée du BOT")
                .setAuthor("Panel d'Aide de Trust-BOT")
                .setDescription("Voici mes commandes")
                .setTimestamp()
                message.delete()
                message.channel.sendEmbed(embed)
            break;

            case "admin":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
            limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                    message.delete()
            var embed = new Discord.RichEmbed()
                .addField("s.purge", "Pour supprimer les messages, faites a.purge + (le nombre de message à supprimer dans le channel)")
                .addField("s.annonce", "Met un message dans Information, faites a.annonce + (le message à mettre dans information)")
                .addField("s.@annonce", "Met un message dans information avec une mention dans lequel vous avez écrit, faites a.@annonce (dans un channel) + le texte que vous voulez mettre")
                .setColor("#ff0000")
                .setFooter("Idée de commandes ? Proposez des commandes à Quentinium en MP !")
                .setAuthor("Panel d'Aide Admin")
                .setDescription("Voici mes commandes d'Admin")
                .setTimestamp()
                message.delete()
                message.channel.sendEmbed(embed)
            break;

        case "traductionhelp":
            var embed = new Discord.RichEmbed()
                 .addField("s.tradenfr", "Traduction Anglais ==> Français !") 
                 .addField("s.tradfren", "Traduction Français ==> Anglais !")
                 .addField("s.tradesfr", "Traduction Espagnol ==> Français !")
                 .addField("s.tradfres", "Taduction Français ==> Espagnol !")
                 .addField("s.tradesen", "Traduction Espagnol ==> Anglais !")
                 .addField("s.tradenes", "Taduction Anglais ==> Espagnol !")            
                .setColor("#00ffcc")
                .setFooter("Amuse toi à traduire petit enfant !")
                .setAuthor("Pannel d'Aide de Traduction")
                .setDescription("Petit rappelle, je vais seulement envoyé un liens google traduction !")
                .setTimestamp()
                message.delete()
                message.channel.sendEmbed(embed)
             console.log("Il veut traduire" + message.author.username + "!")
            break;

        case "tradenfr":
        let tradenfr = message.content.split(' ');
        tradenfr.shift();
        console.log("Traduction Anglais ==> Français");
        message.reply('https://translate.google.fr/#en/fr/' + tradenfr.join('%20'));
        break;

        case "tradfren":
         let tradfren = message.content.split(' ');
         tradfren.shift();
         console.log("Traduction Français ==> Anglais");
         message.reply('https://translate.google.fr/#fr/en/' + tradfren.join('%20'));
         break;

         case "tradesfr":
         let tradesfr = message.content.split(' ');
         tradesfr.shift();
         console.log("Traduction Espagnol ==> Français");
         message.reply('https://translate.google.fr/#es/fr/' + tradesfr.join('%20'));
         break;
      
        case "tradfres":
         let tradfres = message.content.split(' ');
         tradfres.shift();
         console.log("Traduction Français ==> Espagnol");
         message.reply('https://translate.google.fr/#fr/es/' + tradfres.join('%20'));
         break;      
      
        case "tradenes":
         let tradenes = message.content.split(' ');
         tradenes.shift();
         console.log("Traduction Anglais ==> Espagnol");
         message.reply('https://translate.google.fr/#en/es/' + tradesen.join('%20'))
         break;

        case "ping":
        message.channel.sendMessage("Pong! J'ai actuellement `" + bot.ping + " ms !` :D");
        message.delete();
        break;

        case "purge":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
            var embed = new Discord.RichEmbed()
            .addField("Commande :", "Purge d'un Channel")
            .addField("Modérateur :", message.author.username)
            .addField("Message supprimé", messagecount)
            .addField("Heure:", message.channel.createdAt)
            .setColor("#009999")
            .setFooter("Ouf ! Sa as fait un bon ménage dans le serveur ! ^^")
            message.delete()
            member.guild.channels.find("name", "logs").sendEmbed(embed);
            break;

        case "membres":
     message.reply("Nous sommes actuellement ``" + message.guild.memberCount + " membres`` sur ``" + message.guild.name + "`` !");
     message.delete();
     break;

        case "google":
    let glg = message.content.split(' ');
    glg.shift();
    console.log("J'ai rechercher sur Google!" + message.author.username + " !!");
    message.reply('https://www.google.fr/#q=' + glg.join('%20'));
    message.delete();
    break;

        case "youtube":
    let ytb = message.content.split(' ');
    ytb.shift();
    console.log("J'ai rechercher sur Youtube!" + message.author.username + " !!");
    message.reply('https://m.youtube.com/results?search_query=' + ytb.join('+'));
    message.delete();
    break;

    case "annonce":
         if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
     let sondage = message.content.split(" ");
     sondage.shift();
   var embed = new Discord.RichEmbed()
   .addField("Nouvauté!", " "+ sondage.join(" "))
   .setColor("#fcff00")
   .setTimestamp()
   message.delete();
   member.guild.channels.find("name", "information").sendEmbed(embed);
   break;

        case "@annonce":
         if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. :x:");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
       let newi = message.content.split(" ");
       newi.shift();
     var embed = new Discord.RichEmbed()
     .addField("Annonces !", " "+ newi.join(" "))
     .setColor("#fcff00")
     .setTimestamp()
     message.delete();
     message.channel.send("@everyone Du nouveau sur le serveur, regardez dans #information !")
     member.guild.channels.find("name", "information").sendEmbed(embed);
     break;

        default:
            message.channel.sendMessage("Commande invalide ^^ Fait s.help pour voir toutes les commandes disponibles !")
            message.delete();
    }
});

bot.login("NDU1Nzk1NDA2MDA2Mzg2NzA5.DgJ0jQ.sAVCnxya3ycsidsC0a05ROJFvZE");