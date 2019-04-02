'use strict';
const exec = require('child_process').exec;
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./kim.json');
var getJSON = require('get-json');
var api = require('twitch-api-v5');
var flagged = "1";
api.clientID = '70n69vrjcff5dtdz0ol0d1zv0mlukv';
var http = require("https");
var twi;
var checkreturn;
var NanoTimer = require('nanotimer');
var cluster = require('cluster');
var request = require('request');
var fs = require('fs');
var livestreamchannel = "489481949392404483";
var sub = "";
var mods = "";
var subid = "491203376617357313";
var modid = "413663810822340628";
var serverid = "228488002039578624";
var Downloader = require("filedownloader");

if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', function(worker, code, signal) {
        cluster.fork();
    });
}
if (cluster.isWorker) {
    function logError(err) {
        return err && console.log(err);
    }

    function respond(channelID, msg) {
        bot.sendMessage({
            to: channelID,
            message: msg
        });
    }

    logger.remove(logger.transports.Console);
    logger.add(logger.transports.Console, {
        colorize: true
    });
    logger.level = 'debug';
    // Initialize Discord Bot
    var bot = new Discord.Client({
        token: auth.token,
        autorun: true
    });
    bot.on('ready', function(evt) {
        logger.info('Connected');
        logger.info('Logged in as: ');

        bot.setPresence({
            game: {
                name: "auf Freiraumreh.de"
            }
        })
        logger.info(bot.username + ' - (' + bot.id + ')');
        logger.info('Bot is online.');
        var timer = new NanoTimer;
        timer.setInterval(function() {
            checkblog(timer);
        }, '', '900s');
    });

    bot.on('message', function(user, userID, channelID, message, evt) {
        // Our bot needs to know if it will execute a command
        // It will listen for messages that will start with `!`
        if (message.substring(0, 1) == '!') {
            var args = message.substring(1).split(' ');
            var fuehr = message.substring(1).split('"');
            var cmd = args[0];
            args = args.splice(1);
            fuehr = fuehr.splice(1);
            switch (cmd.toLowerCase()) { // ignore case in commands
                case 'addjoke':
                    if (typeof fuehr[0] === "undefined") {
                        respond(channelID, "Irgendwas is superdoof :( Hast du deinen Witz in Anführungszeichen gesetzt?");
                    } else {
                        fs.appendFile("witze.txt", fuehr[0] + "<joke>", logError);
                        var text = fs.readFileSync("./witze.txt").toString('utf-8');
                        var textByLine = text.split("<joke>");
                        respond(channelID, "Witz (Nr. " + textByLine.length + ") erfolgreich ergänzt, vielen Dank für deinen Beitrag.");
                    }
                    break;
                case 'addquote':
                    if (typeof fuehr[0] === "undefined") {
                        respond(channelID, "Irgendwas is superdoof :( Hast du dein Zitat in Anführungszeichen gesetzt?");
                    } else {
                        fs.appendFile("quotes.txt", fuehr[0] + "<quote>", logError);
                        var text = fs.readFileSync("./quotes.txt").toString('utf-8');
                        var textByLine = text.split("<quote>");
                        respond(channelID, "Zitat (Nr. " + textByLine.length + ") erfolgreich ergänzt, vielen Dank für deinen Beitrag.");
                    }
                    break;
                case 'addmoti':
                    if (typeof fuehr[0] === "undefined") {
                        respond(channelID, "Irgendwas is superdoof :( Hast du deine Motivation in Anführungszeichen gesetzt?");
                        break;
                    } else {
                        fs.appendFile("motivation.txt", fuehr[0] + "<moti>", logError);
                        var text = fs.readFileSync("./motivation.txt").toString('utf-8');
                        var textByLine = text.split("<moti>");
                        respond(channelID, "Motivation (Nr. " + textbyLine.length + ") erfolgreich ergänzt, vielen Dank für deinen Beitrag.");
                        break;
                    }
                case 'status':
                    respond(channelID, "Ich bin da :) <@!" + userID + ">");
                    break;
                    //case 'newslett':
                    //    respond(channelID, "My Body is ready for you <@!" + userID + ">");
                    //    break;
                case 'commands':
                    respond(channelID, '*Diese Commands sind verfügbar:*\n\n *Allgemein:* \n\n # !wave \n # !social \n # !thomas \n # !motivation \n # !mimimi \n # !quote \n # !joke \n # !addjoke "Witz hier einfügen (in Anführungszeichen)"\n # !addmoti "Motivationsspruch hier einfügen (in Anführungszeichen)"# \n # !addquote "Zitat hier einfügen (in Anführungszeichen)"\n \n Freiraumbot is created by <@252440250176110592>');
                    break;
                case '#bestof':
                    rnd(channelID, userID);
                    break;
                case 'joke':
                    joke(channelID, userID);
                    break;
                case 'motivation':
                    motivation(channelID, userID);
                    break;
                case 'quote':
                    quote(channelID, userID);
                    break;
                case 'dl':
                    checkblog(channelID, userID);
                    break;
                case 'thomas':
                    respond(channelID, "Das Leben ist wie eine Schachtel Pralinen – Alles zum Kotzen.");
                    break;
                case 'ne':
                    respond(channelID, "Ich hab heut leider kein Foto für dich.");
                    break;
                case 'glübe':
                    respond(channelID, "Das Beste am Tag bist du ! :heart_exclamation:");
                    break;
                case 'mimimi':
                    respond(channelID, "Vom Mond aus betrachtet spielt das ganze keine so große Rolle mehr.");
                    break;
                case 'newsletter':
                    if (userID === "25244025017611059s" || userID === "228486937059655680") {
                        respond("561116168199602176", "Kim hat soeben einen neuen Newsletter per Mail verschickt - @everyone Schaut rein :wink:")
                    } else {
                        respond(channelID, "Dazu hast du leider keine Berechtigungen, sorry!");
                    }
                    break;
                case 'wave':
                    respond(channelID, "<@255311220821852160> is wonderful.");
                    break;
                case 'social':
                    bot.sendMessage({
                        to: channelID,
                        message: '',
                        embed: {
                            color: 0x9482C9,
                            title: "",
                            url: "https://freiraumreh.de",
                            description: "",
                            thumbnail: {
                                url: "https://www.freiraumreh.de/wp-content/uploads/2018/12/1-665x663.png"
                            },
                            author: {
                                name: "Freiraumreh - Social Media",
                                icon_url: "https://www.freiraumreh.de/wp-content/uploads/2018/11/cropped-freiraumreh3k-32x32.jpg"
                            },

                            fields: [{
                                    name: "Instagram",
                                    value: "https://instagram.com/freiraumreh"
                                }, {
                                    name: "Twitter",
                                    value: "https://twitter.com/freiraumreh"
                                },
                                {
                                    name: "Pinterest",
                                    value: "https://www.pinterest.de/freiraumreh/"
                                }, {
                                    name: "Twitch",
                                    value: "https://twitch.tv/freiraumreh"
                                }, {
                                    name: "Discord",
                                    value: "https://discord.gg/dVFE3vp"
                                }, {
                                    name: "Soundcloud",
                                    value: "https://soundcloud.com/user-401046924"
                                }, {
                                    name: "Website/Blog",
                                    value: "https://freiraumreh.de"
                                }, {
                                    name: "Newsletter",
                                    value: "https://freiraumreh.de/newsletter/"
                                },
                            ],
                            footer: {
                                text: "Take nothing but pictures, leave nothing but footprints, kill nothing but time.",
                            },
                            "description": ""
                        }

                    });
                    break;
            }
        }
    });

    function readDataset(file, delimiter) {
        var fs = require("fs");
        var text = fs.readFileSync(file).toString('utf-8');
        return text.split(delimiter);
    }

    function randomElement(file, delimiter) {
        var lines = readDataset(file, delimiter);
        var rindex = Math.floor(Math.random() * (lines.length - 1));
        return lines[rindex];
    }

    function joke(channelID, userID) {
        var el = randomElement("./witze.txt", "<joke>");
        respond(channelID, "```" + el + "```");
    }

    function motivation(channelID, userID) {
        var el = randomElement("./motivation.txt", "<moti>");
        respond(channelID, "```" + el + "```");
    }

    function quote(channelID, userID) {
        var el = randomElement("./quotes.txt", "<quote>");
        respond(channelID, "```" + el + "```");
    }



    function checkblog(channelID, userID) {
        let Parser = require('rss-parser');
        let parser = new Parser();

        (async () => {
            var feed = await parser.parseURL('https://freiraumreh.de/feed');

            var title = feed.items[0].title;
            var link = feed.items[0].link;

            fs.readFile('blog.txt', 'utf8', function(err, data) {
                if (err) throw err;
                if (data === title) {
                    console.log("Kein neuer Eintrag auf Freiraumreh.de/rss/ vorhanden.");
                } else {
                    respond("561116168199602176", "@everyone - Hey ihr Lieben, es gibt einen neuen Blogeintrag unter Freiraumreh.de! \n\n" + "```" + title + "```" + "\n" + link);
                    fs.writeFile("blog.txt", title, logError);
                }
            });
        })();
    }


    function modCheck(userID, channelID) {
        var myMember = bot.servers[serverid].members[userID];
        var counter;
        for (counter = 0; counter < myMember.roles.length; counter++) {
            console.log(myMember.roles[counter]);
            if (myMember.roles[counter] == modid) {
                return "enabled";
            }
        }
        respond(channelID, "Sorry, dieser Command ist nur für die ganz hohen Tiere vorgesehen.");
        return "disabled";
    }

    function subCheck(userID, channelID) {
        var myMember = bot.servers[serverid].members[userID];
        var counter;
        if (typeof myMember === "undefined") {
            respond(channelID, "Sorry Baby, dieser Command steht nur Mitgliedern zur Verfügung.");
            // FIXME: return ?;
        } else {
            for (counter = 0; counter < myMember.roles.length; counter++) {
                console.log(myMember.roles[counter]);
                if (myMember.roles[counter] == subid) {
                    return "enabled";
                }
            }
            respond(channelID, "Sorry Baby, dieser Command steht nur Mitgliedern zur Verfügung.");
            return "disabled";
        }
    }


    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }


    function twitch(timer) {
        //api.streams.channel({ channelID: '54689738' }, (err, res) => {
        api.streams.channel({
            channelID: '54689738'
        }, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                if (res.stream === null) {
                    console.log('Streamer ist offline. Kein Announcement. Prüfe in 60 Sekunden.');
                } else {
                    respond(livestreamchannel, "@everyone xxx ist live ! - " + res.stream.channel.status + " - Kommen Sie, Kommen Sie ! " + res.stream.channel.url);
                    console.log("Streamer ist online ! Remove Interval für Twitch Announcement");
                    timer.clearInterval();
                    console.log("Starte Offlineprüfung");
                    var check = new NanoTimer();
                    check.setInterval(function() {
                        recheck(check);
                    }, '', '90s');
                }
            }
        });
    }

    function recheck(check) {
        api.streams.channel({
            channelID: '54689738'
        }, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                if (res.stream === null) {
                    // console.log('offline');
                    console.log('Stream ist jetzt wieder offline - starte Twitchprüfung');
                    check.clearInterval();
                    var timer = new NanoTimer();
                    timer.setInterval(function() {
                        twitch(timer);
                    }, '', '60s');
                } else {
                    console.log('Stream immernoch online - keine Pruefung noetig');
                }
            }
        });
    }

}
