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
NODE_DEBUG = fs

if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', function(worker, code, signal) {
        cluster.fork();
    });
}
if (cluster.isWorker) {

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
    bot.on('ready', function (evt) {
        logger.info('Connected');
        logger.info('Logged in as: ');

        bot.setPresence({
            game: {
                name: "auf Freiraumreh.de"
            }
        })
        logger.info(bot.username + ' - (' + bot.id + ')');
        logger.info('Starte Twitchpruefung Function');
        var timer = new NanoTimer;
        timer.setInterval(function () {
            download(timer)
        }, '', '900s');
    });

    bot.on('message', function (user, userID, channelID, message, evt) {
        // Our bot needs to know if it will execute a command
        // It will listen for messages that will start with `!`
        if (message.substring(0, 1) == '!') {
            var args = message.substring(1).split(' ');
            var fuehr = message.substring(1).split('"');
            var cmd = args[0];
            args = args.splice(1);
            fuehr = fuehr.splice(1);
            switch (cmd) {
                case 'addjoke':
                    if (typeof fuehr[0] === "undefined") {
                        bot.sendMessage({
                            to: channelID,
                            message: "Irgendwas is superdoof :( Hast du deinen Witz in Anführungszeichen gesetzt?"
                        });
                        break;
                    } else {
                        fs.appendFile("witze.txt", fuehr[0] + "<joke>", function (err) {
                            if (err) {
                                return console.log(err);
                            }
                        });
                        var text = fs.readFileSync("./witze.txt").toString('utf-8');
                        var textByLine = text.split("<joke>");
                        bot.sendMessage({
                            to: channelID,
                            message: "Witz (Nr. " + textByLine.length + ") erfolgreich ergänzt, vielen Dank für deinen Beitrag."
                        });
                        break;
                    }
                case 'addquote':
                    if (typeof fuehr[0] === "undefined") {
                        bot.sendMessage({
                            to: channelID,
                            message: "Irgendwas is superdoof :( Hast du dein Zitat in Anführungszeichen gesetzt?"
                        });
                        break;
                    } else {
                        fs.appendFile("quotes.txt", fuehr[0] + "<quote>", function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            var text = fs.readFileSync("./quotes.txt").toString('utf-8');
                            var textByLine = text.split("<quote>");
                        });
                        bot.sendMessage({
                            to: channelID,
                            message: "Zitat (Nr. " + textByLine.length + ") erfolgreich ergänzt, vielen Dank für deinen Beitrag."
                        });
                        break;
                    }
                case 'addmoti':
                    if (typeof fuehr[0] === "undefined") {
                        bot.sendMessage({
                            to: channelID,
                            message: "Irgendwas is superdoof :( Hast du deine Motivation in Anführungszeichen gesetzt?"
                        });
                        break;
                    } else {
                        fs.appendFile("motivation.txt", fuehr[0] + "<moti>", function (err) {
                            if (err) {
                                return console.log(err);
                            }
                        });
                        var text = fs.readFileSync("./motivation.txt").toString('utf-8');
                        var textByLine = text.split("<moti>");
                        bot.sendMessage({
                            to: channelID,
                            message: "Motivation (Nr. " + textbyLine.length + ") erfolgreich ergänzt, vielen Dank für deinen Beitrag."
                        });
                        break;
                    }
                //case 'status':
                //    bot.sendMessage({
                //        to: channelID,
                //        message: "My Body is ready for you <@!" + userID + ">"
                //    });
                //    break;
                //case 'newslett':
                //    bot.sendMessage({
                //        to: channelID,
                //        message: "My Body is ready for you <@!" + userID + ">"
                //    });
                //break;
                case 'commands':
                    bot.sendMessage({
                        to: channelID,
                        message: '*Diese Commands sind verfügbar:*\n\n *Allgemein:* \n\n # !wave \n # !social \n # !thomas \n # !motivation \n # !mimimi \n # !quote \n # !joke \n # !addjoke \n # !addmoti # \n # !addquote \n \n Freiraumbot is created by <@252440250176110592>'
                    });
                    break;
                case '#bestof':
                    rnd(channelID, userID);
                    break;
                case 'joke':
                    joke(channelID, userID);
                    break;
                case '#feierabend':
                    feierabend(channelID, userID);
                    break;
                case 'penis':
                    bot.sendMessage({
                        to: channelID,
                        message: "Penisbilder bitte direkt an Kim per PM. Die Größe ist entscheidend."
                    });
                    break;
                case 'motivation':
                    motivation(channelID, userID);
                    break;
                case 'quote':
                    quote(channelID, userID);
                    break;
                case 'dl':
                    download(channelID, userID);
                    break;
                case 'thomas':
                    bot.sendMessage({
                        to: channelID,
                        message: "Das Leben ist wie eine Schachtel Pralinen – Alles zum Kotzen."
                    });
                    break;
                case 'ne':
                    bot.sendMessage({
                        to: channelID,
                        message: "Ich hab heut leider kein Foto für dich."
                    });
                    break;
                case 'glübe':
                    bot.sendMessage({
                        to: channelID,
                        message: "Das Beste am Tag bist du ! :heart_exclamation:"
                    });
                    break;
                case 'mimimi':
                    bot.sendMessage({
                        to: channelID,
                        message: "Vom Mond aus betrachtet spielt das ganze keine so große Rolle mehr."
                    });
                    break;
                case 'wave':
                    bot.sendMessage({
                        to: channelID,
                        message: "<@255311220821852160> is wonderful."
                    });
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
                            },
                            {
                                name: "Soundcloud",
                                value: "https://soundcloud.com/user-401046924"
                            },
                            {
                                name: "Website/Blog",
                                value: "https://freiraumreh.de"
                            },
                            {
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


    function dateme(channelID, userID) {
        var calc = Math.floor(Math.random() * 2) + 1;
        if (calc === 1) {
            bot.sendMessage({
                to: channelID,
                message: "Mit dir immer <@!" + userID + "> ! Du findest mich bei Tinder in der Bot Sektion."
            });
        } else if (calc === 2) {
            bot.sendMessage({
                to: channelID,
                message: "Lohnt sich erst ab 20cm unbuffed <@!" + userID + ">. Send nudes pls."
            });
        }
    }

    function joke(channelID, userID) {
        var fs = require("fs");
        var text = fs.readFileSync("./witze.txt").toString('utf-8');
        var arrayOfJokes = text.split("<joke>");
        var calc = Math.floor(Math.random() * (arrayOfJokes.length - 1));
        bot.sendMessage({
            to: channelID,
            message: "```" + arrayOfJokes[calc] + "```"
        });

    }

    function motivation(channelID, userID) {
        var fs = require("fs");
        var text = fs.readFileSync("./motivation.txt").toString('utf-8');
        var textByLine = text.split("<moti>");
        var calc = Math.floor(Math.random() * (textByLine.length - 1));
        bot.sendMessage({
            to: channelID,
            message: "```" + textByLine[calc] + "```"
        });

    }

    function quote(channelID, userID) {
        var fs = require("fs");
        var text = fs.readFileSync("./quotes.txt").toString('utf-8');
        var textByLine = text.split("<quote>");
        var calc = Math.floor(Math.random() * (textByLine.length - 1));
        bot.sendMessage({
            to: channelID,
            message: "```" + textByLine[calc] + "```"
        });

    }


    function download(channelID, userID) {
        let Parser = require('rss-parser');
        let parser = new Parser();

        (async () => {
            var feed = await parser.parseURL('https://freiraumreh.de/feed');

            var title = feed.items[0].title;
            var link = feed.items[0].link;

            fs.readFile('blog.txt', 'utf8', function (err, data) {
                if (err) throw err;
                console.log(data);
                console.log(title);
                if (data === title) {
                    console.log("Kein neuer Eintrag");
                } else {
                    bot.sendMessage({
                        to: "561116168199602176",
                        message: "@everyone - Hey ihr Lieben, es gibt einen neuen Blogeintrag unter Freiraumreh.de! \n\n" + "```" + title + "```" + "\n" + link
                    });
                    fs.writeFile("blog.txt", title, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });

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
                var mods = "enabled";
                break;
            } else {
                var mods = "disabled";
            }
        }
        if (mods == "enabled") {
            return mods;
        } else {
            bot.sendMessage({
                to: channelID,
                message: "Sorry, dieser Command ist nur für die ganz hohen Tiere vorgesehen."
            });
            return mods;

        }
    }

    function subCheck(userID, channelID) {
        var myMember = bot.servers[serverid].members[userID];
        var counter;
        if (typeof myMember === "undefined") {
            bot.sendMessage({
                to: channelID,
                message: "Sorry Baby, dieser Command steht nur Mitgliedern zur Verfügung."
            });
        } else {
            for (counter = 0; counter < myMember.roles.length; counter++) {
                console.log(myMember.roles[counter]);
                if (myMember.roles[counter] == subid) {
                    var sub = "enabled";
                    break;
                } else {
                    var sub = "disabled";
                }
            }
            if (sub == "enabled") {
                return sub;
            } else {
                bot.sendMessage({
                    to: channelID,
                    message: "Sorry Baby, dieser Command steht nur Mitgliedern zur Verfügung."
                });
                return sub;
            }
        }
    }


    String.prototype.capitalize = function () {
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
                    bot.sendMessage({
                        to: livestreamchannel,
                        message: "@everyone xxx ist live ! - " + res.stream.channel.status + " - Kommen Sie, Kommen Sie ! " + res.stream.channel.url
                    });
                    console.log("Streamer ist online ! Remove Interval für Twitch Announcement");
                    timer.clearInterval();
                    console.log("Starte Offlineprüfung");
                    var check = new NanoTimer();
                    check.setInterval(function () {
                        recheck(check)
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
                    timer.setInterval(function () {
                        twitch(timer)
                    }, '', '60s');
                } else {
                    console.log('Stream immernoch online - keine Pruefung noetig');
                }
            }

        });
    }

    function pr0(channelID, zwei) {
        const https = require('https');

        https.get('https://pr0gramm.com/api/items/get/top?tags=' + zwei, (resp) => {
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                if (zwei == "undefined") {
                    bot.sendMessage({
                        to: channelID,
                        message: "Wie wäre es mit nem Suchwort? Lappen."
                    });
                } else {
                    length = JSON.parse(data).items.length;
                    var calc = Math.floor(Math.random() * length);
                    count = JSON.parse(data).items[calc].image;
                    console.log(count);
                    zwei = decodeURIComponent(zwei);
                    var filename = count.substring(count.lastIndexOf('/') + 1);
                    console.log(filename);
                    console.log("https://img.pr0gramm.com/" + count);
                    var Dl = new Downloader({
                        url: "https://img.pr0gramm.com/" + count
                    }).on("progress", function (progress) {
                        console.log(progress);
                    }).on("end", function () {
                        bot.uploadFile({
                            to: channelID,
                            file: filename
                        }, function (err, res) {
                            console.log(err)
                            fs.unlink(filename);
                        });
                    });
                }
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
}