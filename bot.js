const mySecret = process.env['TOKEN']

require('events').EventEmitter.prototype._maxListeners = 212;
const keepAlive = require("./server.js")
Discord = require("discord.js");
const Database = require("@replit/database")
const client = new Discord.Client();
client.login(mySecret);


keepAlive()
var rf = require('random-facts'); 
var WikiFakt = require('wikifakt');
const Memer = require("random-jokes-api");
const minigames = require('discord-minigames')
const db = new Database()
const redditFetch = require('reddit-fetch');
const ms = require("pretty-ms")
const currency = "<:Sharkents:944451147010297916>"


async function setKey(key, value) {
    await db.set(key, value);
};

async function getKeyValue(key) {
    let value = await db.get(key);
    if(value === null){
       value = 0 
    }
    if(value = "undefined"){
      value = 0
    }
    return value;
};

async function deleteKey(key) {
    await db.delete(key);
};




client.on('ready', () => { 
  client.user.setActivity("Minecraft and listening to Sharky's orders");
})
client.on('message', async (message) => {
if(message.content === ('E!balance')||message.content  === ('E!bal')){
  let balance = getKeyValue(`wallet_${message.author.id}`)
  let MoneyEmbed = new Discord.MessageEmbed()
    .setTitle(`${message.author.username}'s Balance`)
    .setDescription(`Wallet:${currency}${balance} sharkents`) 
    .setColor("BLUE")
    .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
  message.channel.send(MoneyEmbed)
}
})  
client.on('message', async (message) => {
if(message.content  === ("E!Work")||message.content  === ('E!work')){
 let amount = Math.floor(Math.random()*10)
 let WorkEmbed = new Discord.MessageEmbed()
  .setTitle(`${message.author.username}'s Job`)
  .setDescription(`You earned ${currency}`+ amount)
  .setColor("BLUE")
  .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
  message.channel.send(WorkEmbed)
setKey(`wallet_${message.author.id}`,getKeyValue(`wallet_${message.author.id}`+amount))
}
});
client.on('message', async (message) => {
  const aId = `${message.author.id}`
  let balance = await db.get(`wallet_` + aId )
  if ((message.content) == 'give me epico number sharkents') {
  await db.set(`wallet_${message.author.id}`, balance + 55)
  message.channel.send(`Noice, you just got <:Sharkents:944451147010297916>55 sharkents you are pro`);
  }
});
client.on('message', async (message) => {
    if (message.content === "E!commands") {


        let Cmds = new Discord.MessageEmbed()
        .setTitle(`List of Commands :notepad_spiral:`)
        .setDescription(`There are many types of commands these are seperated into 4 categories \n \n **E!RateCommands** \n **E!TextCommands** \n **E!JokeCommands** \n **E!ImageCommands** \n \n *to see the commands type the corresponding triggers for each set of commands*`)
        .setColor('#0000FF')
        .setFooter(`type these on the server not in dms`)

        message.channel.send(Cmds)
    }
});
client.on('message', async (message) => {
    if (message.content === "E!TextCommands") {


        let TCmds = new Discord.MessageEmbed()
        .setTitle(`Text Commands`)
        .setDescription(`desi, bruh, 420, 69, shark, i dont have a life, im cool, Swear word censorship ***this is not a command this just says language to some not good boi words***, sharky, pls rob, E!help, sus, suck, ur mom, dab, gay, amogus, burb, poop, sbeve, carlos, dabean, 5, am pro, redstone, poppy, cringe, oof, tiktok, ez, AYYY, imagine, nerd, nom nom, math, chomp, bean, insane, do do do do, am speed, vamos, mathy, a speed,:no_entry_sign: :brain:, ., .., ..., ....,:brain:, casper, uwu, TwT, TvT, pce, nou, rino, b, friends`)
        .setColor('#0000FF')
        .setFooter(`E!inv`)

        message.channel.send(TCmds)
    }
});
client.on('message', async (message) => {
    if (message.content === "E!RateCommands") {


        let RCmds = new Discord.MessageEmbed()
        .setTitle(`Rate Commands :sunglasses:`)
        .setDescription(`E!howgay, E!howcool, E!howsus, E!howmean, E!howdumb, E!lierate, E!howfat`)
        .setColor('#0000FF')
        .setFooter(`E!inv`)

        message.channel.send(RCmds)
    }
});
client.on('message', async (message) => {
    if (message.content === "E!JokeCommands") {


        let JCmds = new Discord.MessageEmbed()
        .setTitle(`Joke Commands :rofl:`)
        .setDescription(`**E!meme**, E!fact, E!joke, E!pun, E!showerthought, E!roast, E!quote`)
        .setColor('#0000FF')
        .setFooter(`E!inv`)

        message.channel.send(JCmds)
    }
});
client.on('message', async (message) => {
    if (message.content === "E!ImageCommands") {


        let ICmds = new Discord.MessageEmbed()
        .setTitle(`Image Commands :camera_with_flash:`)
        .setDescription(`**E!meme**, E!dog, E!cat, rick roll me plz `)
        .setColor('#0000FF')
        .setFooter(`E!site`)

        message.channel.send(ICmds)
    }
});
client.on('message', async (message) => {
  if (message.content  === ('tanush')) {
    message.channel.send(String(`he is pro sexy guy`));
  }

});
client.on('message', async (message) => {
  if ((message.content) == 'tansuj') {
    message.channel.send(String(`is pro sexy guy
`));
  }

});
client.on('message', async (message) => {
  if ((message.content) == 'technoblade') {
    message.channel.send(String(` https://ih1.redbubble.net/image.1602782680.2744/mo,small,flatlay,product_square,600x600.jpg`));
  }

});
client.on('message', async (message) => {
  if ((message.content) == 'sbeve bad') {
    message.channel.send(String(`https://tenor.com/view/skill-issue-ratio-cancelled-twitter-cringe-gif-23133228`));
  }

});
client.on('message', async (message) => {
  if ((message.content) == 'E!servers') {
    message.channel.send(String(`sbeve is in ${client.guilds.cache.size} servers `));
  }

});
client.on('message', async (message) => {
  if ((message.content === ('pain'))) {
    message.channel.send(`999777555A`);
  }

});
client.on('message', async (message) => {
  if ((message.content === ('hax'))) {
    message.channel.send(`not pro ||desi doesnt do them||`);
  }

});
client.on("message", async (message) => {
    if (message.content === "E!meme") {
            if (Math.floor(Math.random() * 10) > 6){
            redditFetch({
    
            subreddit: 'dankmemes',
            sort: 'hot',
            allowNSFW: false,
            allowModPost: true,
            allowCrossPost: true,
            allowVideo: true
    
          }).then(post => {
        console.table(post)
        let DankMemeEmbed = new Discord.MessageEmbed()
            .setTitle(`${post.title}`)
            .setImage(`${post.url}`)
            .setColor('#0000FF')
            .setFooter(`${post.subreddit_name_prefixed}`)
        message.channel.send(DankMemeEmbed)
    });
        }else if(Math.floor(Math.random()*10) < 3.333){
            redditFetch({
    
            subreddit: 'meme',
            sort: 'hot',
            allowNSFW: false,
            allowModPost: true,
            allowCrossPost: true,
            allowVideo: true
    
          }).then(post => {
        console.table(post)
        let MemeEmbed = new Discord.MessageEmbed()
            .setTitle(`${post.title}`)
            .setImage(`${post.url}`)
            .setColor('#0000FF')
            .setFooter(`${post.subreddit_name_prefixed}`)
        message.channel.send(MemeEmbed)
    });
        }else{
            redditFetch({
    
            subreddit: 'memes',
            sort: 'hot',
            allowNSFW: false,
            allowModPost: true,
            allowCrossPost: true,
            allowVideo: true
    
          }).then(post => {
        console.table(post)
        let MemesEmbed = new Discord.MessageEmbed()
            .setTitle(`${post.title}`)
            .setImage(`${post.url}`)
            .setColor('#0000FF')
            .setFooter(`${post.subreddit_name_prefixed}`)
        message.channel.send(MemesEmbed)
    });
        }
      }
      

});
client.on("message", async (message) => {
    if (message.content === "E!memetop") {
            if (Math.floor(Math.random() * 10) > 6){
            redditFetch({
    
            subreddit: 'dankmemes',
            sort: 'top',
            allowNSFW: false,
            allowModPost: true,
            allowCrossPost: true,
            allowVideo: true
    
          }).then(post => {
        console.table(post)
        let DankMemeEmbed = new Discord.MessageEmbed()
            .setTitle(`${post.title}`)
            .setImage(`${post.url}`)
            .setColor('#0000FF')
            .setFooter(`${post.subreddit_name_prefixed}`)
        message.channel.send(DankMemeEmbed)
    });
        }else if(Math.floor(Math.random()*10) < 3.333){
            redditFetch({
    
            subreddit: 'meme',
            sort: 'top',
            allowNSFW: false,
            allowModPost: true,
            allowCrossPost: true,
            allowVideo: true
    
          }).then(post => {
        console.table(post)
        let MemeEmbed = new Discord.MessageEmbed()
            .setTitle(`${post.title}`)
            .setImage(`${post.url}`)
            .setColor('#0000FF')
            .setFooter(`${post.subreddit_name_prefixed}`)
        message.channel.send(MemeEmbed)
    });
        }else{
            redditFetch({
    
            subreddit: 'memes',
            sort: 'top',
            allowNSFW: false,
            allowModPost: true,
            allowCrossPost: true,
            allowVideo: true
    
          }).then(post => {
        console.table(post)
        let MemesEmbed = new Discord.MessageEmbed()
            .setTitle(`${post.title}`)
            .setImage(`${post.url}`)
            .setColor('#0000FF')
            .setFooter(`${post.subreddit_name_prefixed}`)
        message.channel.send(MemesEmbed)
    });
        }
      }
      

});
client.on("message", async (message) => {
    if (message.content === "E!cat") {

        let cat = Memer.cat()

        message.channel.send(cat)
    }
});
client.on("message", async (message) => {
    if (message.content === "E!dog") {

        let dog = Memer.dog()

        message.channel.send(dog)
    }
});
client.on("message", async (message) => {
    if (message.content === "E!joke") {

        let jokes = Memer.joke()

        message.channel.send(jokes)
    }
});
client.on("message", async (message) => {
    if (message.content === "E!pun") {

        let puns = Memer.pun()

        message.channel.send(puns)
    }
});
client.on("message", async (message) => {
    if (message.content === "E!roast") {

        let roast = Memer.roast()

        message.channel.send(roast)
    }
});
client.on("message", async (message) => {
    if (message.content === "E!quote") {

        let quotes = Memer.quotes()

        message.channel.send(quotes)
    }
});
client.on("message", async (message) => {
    if (message.content === "E!showerthought") {

        let shower = Memer.showerThought()

        message.channel.send(shower)
    }
});
client.on("message", async (message) => {
    if (message.content === "E!chucknorris") {

        let chuck = Memer.chuckNorris()

        message.channel.send(chuck)
    }
});
client.on('message', async (message) => {
  if (message.content === ('E!fact')) {
    message.channel.send(String(rf.randomFact()));
  }
});
client.on('message', async (message) => {
  if ((message.content) == 'goodnight' || message.content === 'gn') {
    message.channel.send(String(`have a good sleep ${message.author}:wave:`));
  } else if (message.content === 'E!id') {
    message.channel.send(String(`${message.author.id}`));
  } else if (message.content === 'E!site') {
    message.channel.send(String('https://Sbeve.armaanstem.repl.co'));
  } else if (message.content === 'E!guitarnotes' || message.content === 'i need notes') {
    message.channel.send(String('https://cdn.discordapp.com/attachments/937843873147940877/944767856694939679/guitar-fretboard-notes-chart.png'));
  } else if (message.content === 'gimme song "Over the Waves"' || message.content === 'gimme OtW') {
    message.channel.send(String('https://www.guitarnick.com/over-the-waves-easy-guitar-tab.html'));
  } else if (message.content === 'kimi') {
    message.channel.send(String(':b:woah'));
  } else if (message.content === 'guitar') {
    message.channel.send(String('muy epico'));
  } else if (message.content === 'geometry dash') {
    message.channel.send(String('***S T R E S S***'));
  } else if (message.content === 'bruh') {
    message.channel.send(String('thats kinda cringe'));
  } else if (message.content === 'im cool') {
    message.channel.send(String('No idiot your not :)'));
  } else if (message.content === '420') {
    message.channel.send(String('weed :woozy_face:'));
  } else if (message.content === 'i dont have a life') {
    message.channel.send(String('same....'));
  } else if (message.content === 'desi') {
    message.channel.send(String('Iscool'));
  } else if (message.content === '69') {
    message.channel.send(String('nice'));
  } else if (message.content === 'shark') {
    message.channel.send(String('alligator better'));
  } else if (message.content === 'SU' || message.content === 'su') {
    message.channel.send(String('ur annoying just say "shut up"'));
  } else if (message.content === 'gay') {
    message.channel.send(String('thats so yesterday'));
  } else if (message.content === 'ass' || message.content === 'ASS' || message.content === 'Ass') {
    message.channel.send(String('***LANGUAGE***'));
  } else if (message.content === 'plushland') {
    message.channel.send(String('home of me and other plushes (including sharky)'));
  } else if (message.content === 'test_001') {
    message.channel.send(String(Date.now()));
  } else if (message.content === 'sharkents') {
    message.channel.send(String('MONEYMONEYMONEYMONEYMONEYMONEYMONEY'));
  } else if (message.content === 'ur mom') {
    message.channel.send(String('stop it please ur not funny UR NOT FUNNY'));
  } else if (message.content === 'suck') {
    message.channel.send(String('thats what she said :smirk:'));
  } else if (message.content === 'sus') {
    message.channel.send(String('amogus <:sussanta:912516297777115166>'));
  } else if (message.content === 'E!help') {
    message.channel.send(String('lmao u need help? thats kinda cringe jk lol do E!commands'));
  } else if (message.content === 'sharky') {
    message.channel.send(String('Isn\'t hot'));
  } else if (message.content === 'pls rob') {
    message.channel.send(String('pls disable rob'));
  } else if (message.content === 'dab') {
    message.channel.send(String('thats so 2016'));
  } else if (message.content === 'code 89') {
    message.channel.send(String('injecting trojan virus...'));
  } else if (message.content === 'injecting trojan virus...') {
    message.channel.send(String('done'));
  } else if (message.content === 'help me chill') {
    message.channel.send(String('https://www.youtube.com/watch?v=MNWC4NMWfe8'));
  } else if (message.content === 'amogus') {
    message.channel.send(String('sus '));
  } else if (message.content === 'dumbass') {
    message.channel.send(String('idot better '));
  } else if (message.content === 'idot') {
    message.channel.send(String('good job :thumbsup:'));
  } else if (message.content === 'E!inv') {
    message.channel.send(String('https://discord.com/api/oauth2/authorize?client_id=842032435318489108&permissions=0&scope=bot or if u think think this is a ip logger :rolling_eyes: click my profile :D '));
  } else if (message.content === 'burb') {
    message.channel.send(String('fard'));
  } else if (message.content === 'poop') {
    message.channel.send(String('is brown \n User.Mention'));
  }
});
client.on('message', async (message) => {
  if (message.content === 'sbeve') {
    message.channel.send(String('is da best bot'));
  } else if (message.content === 'carlos') {
    message.channel.send(String('sainz'));
  } else if (message.content === 'dabean') {
    message.channel.send(String('DABEANNNN'));
  } else if (message.content === '5') {
    message.channel.send(String('55'));
  } else if (message.content === 'am pro') {
    message.channel.send(String('am sbeve'));
  } else if (message.content === 'redstone') {
    message.channel.send(String('nom nom'));
  } else if (message.content === 'poppy') {
    message.channel.send(String('poopy'));
  } else if (message.content === 'cringe') {
    message.channel.send(String('nou'));
  } else if (message.content === 'oof') {
    message.channel.send(String('egg in french'));
  } else if (message.content === 'ez') {
    message.channel.send(String('easy :sunglasses:'));
  } else if (message.content === 'tiktok') {
    message.channel.send(String('IS THE CRINGIEST THING EVER'));
  } else if (message.content === 'AYYY') {
    message.channel.send(String('what hapnd?'));
  } else if (message.content === 'ayyy') {
    message.channel.send(String('what hapnd?'));
  } else if (message.content === 'imagine') {
    message.channel.send(String('cringe imagine imagining'));
  } else if (message.content === ':/') {
    message.channel.send(String(':neutral_face:'));
  } else if (message.content === 'nerd') {
    message.channel.send(String('its actually "nud" :brain:'));
  } else if (message.content === 'Nerd') {
    message.channel.send(String('its actually "nud" :brain:'));
  } else if (message.content === 'NERD') {
    message.channel.send(String('its actually "nud" :brain:'));
  } else if (message.content === 'nErd') {
    message.channel.send(String('its actually "nud" :brain:'));
  } else if (message.content === 'neRD') {
    message.channel.send(String('its actually "nud" :brain:'));
  } else if (message.content === 'nERD') {
    message.channel.send(String('its actually "nud" :brain:'));
  } else if (message.content === 'nERd') {
    message.channel.send(String('its actually "nud" :brain:'));
  } else if (message.content === 'nerdd') {
    message.channel.send(String('its actually "nud" :brain:'));
  } else if (message.content.toLowerCase() === 'komal') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'Komal') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'KOMAL') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'komaL') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'kOmAl') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'KoMaL') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'kOMAL') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'math') {
    message.channel.send(String('number :brain:'));
  } else if (message.content === 'komal.') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === '.komal') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'k.omal') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'kom.al') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'ko.mal') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'koma.l') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'nom nom') {
    message.channel.send(String('chomp'));
  } else if (message.content === 'Komal.') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'KOMAL.') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'KOMAL..') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'komal..') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'komal...') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'Komal...') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'Komal..') {
    message.channel.send(String('its actually "kaml" :camel:'));
  } else if (message.content === 'chomp') {
    message.channel.send(String('nom nom nom'));
  } else if (message.content === 'bean') {
    message.channel.send(String('amogus bean'));
  } else if (message.content === 'insane') {
    message.channel.send(String('nou'));
  } else if (message.content === 'do do do do') {
    message.channel.send(String('drem is speed'));
  } else if (message.content === 'am speed') {
    message.channel.send(String('https://tenor.com/view/car-racing-f1-formula1-motorsport-gif-13461151'));
  } else if (message.content === 'vamos') {
    message.channel.send(String('VAMOS'));
  } else if (message.content === 'VAMOS') {
    message.channel.send(String('VAMOOOOOOOOOOOOOOOOOOOOOOOOOOOOOS'));
  } else if (message.content === 'mathy') {
    message.channel.send(String('more numbers'));
  } else if (message.content === 'rick roll me plz') {
    message.channel.send(String('ok sure https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713'));
  } else if (message.content === 'rickroll me pls') {
    message.channel.send(String('ok sure https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713'));
  } else if (message.content === 'rick roll me pls') {
    message.channel.send(String('ok sure https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713'));
  } else if (message.content === 'nou') {
    message.channel.send(String('https://img.ifunny.co/images/814fdf6d82d4c5f500063ad0397cb1b4c686e6516499527d5f26253b4dc5ad11_1.jpg'));
  } else if (message.content === 'pce') {
    message.channel.send(String('https://c.tenor.com/xjz_SE0yqXQAAAAC/peace-disappear.gif'));
  } else if (message.content === '1') {
    message.channel.send(String('2'));
  } else if (message.content === '3') {
    message.channel.send(String('4'));
  } else if (message.content === '5') {
    message.channel.send(String('6'));
  } else if (message.content === '7') {
    message.channel.send(String('8'));
  } else if (message.content === 'hi') {
    message.channel.send(String(`hi ${message.author} :wave:`));
  } else if (message.content === '9') {
    message.channel.send(String('10'));
  } else if (message.content === '11') {
    message.channel.send(String('shut up, i get it you know how to count'));
  } else if (message.content === 'friends') {
    message.channel.send(String('you have friends??????'));
  } else if (message.content === '._.') {
    message.channel.send(String('seggsy man'));
  } else if (message.content === '👲') {
    message.channel.send(String('man with chineese topi'));
  } else if (message.content === 'dhairya') {
    message.channel.send(String('dheri199 weird'));
  } else if (message.content === 'Dhairya') {
    message.channel.send(String('dheri199 weird'));
  } else if (message.content === 'peepeepoopoo') {
    message.channel.send(String('rip peepeepoopoo https://www.youtube.com/watch?v=vnuNICfP2aA&ab_channel=DaybyDave'));
  } else if (message.content === 'why') {
    message.channel.send(String('why not!?'));
  } else if (message.content === '👍') {
    message.channel.send(String(':toothbrush:'));
  } else if (message.content === 'bye') {
    message.channel.send(String('bye :wave:'));
  } else if (message.content === 'cya') {
    message.channel.send(String('bye :wave:'));
  } else if (message.content === 'ding') {
    message.channel.send(String('dong '));
  } else if (message.content === 'idiot') {
    message.channel.send(String('idiot sandwich'));
  } else if (message.content === 'hablas español?') {
    message.channel.send(String('cringe mal ew repugnante eres muy malo eres cringe cringe cringe cringe eres malo tu caca deberías morir en un agujero idiota tonto'));
  } else if (message.content === 'neil') {
    message.channel.send(String('is weird'));
  } else if (message.content === 'anime') {
    message.channel.send(String('is cringe'));
  } else if (message.content === 'E!howcool') {
    if (message.author.id === '637386137240993797' || message.author.id === '957706043562016799') {
      let Coolembed2 = new Discord.MessageEmbed()
        .setTitle(`cool rate`)
        .setDescription(`**you are** ` + (Math.floor(Math.random() * (100 - 90 + 1) + 90)) + `% cool! \n :sunglasses:`)
        .setColor('#0000FF')
        .setFooter(`E!inv`);

      message.channel.send(Coolembed2);
    } else if (message.author.id === `709460181108523030`) {
      let Coolembed = new Discord.MessageEmbed()
        .setTitle(`cool rate`)
        .setDescription(`**you are** ` + (Math.floor(Math.random() * (10 - 1 + 1) + 1)) + "% cool! \n :sunglasses:")
        .setColor('#0000FF')
        .setFooter(`E!inv`);

      message.channel.send(Coolembed);
    } else {
      let Coolembed = new Discord.MessageEmbed()
        .setTitle(`cool rate`)
        .setDescription(`**you are** ` + (Math.floor(Math.random() * 100) + 1) + "% cool! \n :sunglasses:")
        .setColor('#0000FF')
        .setFooter(`E!inv`);

      message.channel.send(Coolembed);
    }
  } else if (message.content === 'E!simprate') {
    let Simpembed = new Discord.MessageEmbed()
      .setTitle(`simp rate :flushed:`)
      .setDescription(`**you are** ` + (Math.floor(Math.random() * 100) + 1) + "% of a simp! \n not cool :neutral_face:")
      .setColor('#0000FF')
      .setFooter(`E!inv`);

    message.channel.send(Simpembed);
  } else if (message.content === 'E!howsus') {
    let Susembed = new Discord.MessageEmbed()
      .setTitle(`sus detector <:sussanta:912516297777115166>`)
      .setDescription(`**you are** ` + (Math.floor(Math.random() * 100) + 1) + "% sus! \n kinda amogus ngl ")
      .setColor('#0000FF')
      .setFooter(`E!inv`);

    message.channel.send(Susembed);
  } else if (message.content === 'E!howmean') {
    let Meanembed = new Discord.MessageEmbed()
      .setTitle(`rudeness rate`)
      .setDescription(`**you are** ` + (    Math.floor(Math.random() * 100) + 1) + "% rude! \n not nice bro :pensive: ")
      .setColor('#0000FF')
      .setFooter(`E!inv`);

    message.channel.send(Meanembed);
  } else if (message.content === 'E!lierate') {
    let Lieembed = new Discord.MessageEmbed()
      .setTitle(`Lie Detector`)
      .setDescription(`**you are** ` + (Math.floor(Math.random() * 100) + 1) + "% of a liar! \n watch out people :liar: ")
      .setColor('#0000FF')
      .setFooter(`E!inv`);

    message.channel.send(Lieembed);
  } else if (message.content === 'E!howfat') {
    let Fatembed = new Discord.MessageEmbed()
      .setTitle(`Chonky Checker`)
      .setDescription(`**you are** ` + (Math.floor(Math.random() * 100) + 1) + "% fat \n can't beat your mom doe :joy: :rofl: ")
      .setColor('#0000FF')
      .setFooter(`E!inv`);

    message.channel.send(Fatembed);
  } else if (message.content === 'E!howgay') {
    let Gayembed = new Discord.MessageEmbed()
      .setTitle(`Gay R8`)
      .setDescription(`**you are** ` + (Math.floor(Math.random() * 100) + 1) + "% gay \n well guess you just can't look straight :rainbow_flag: ")
      .setColor('#0000FF')
      .setFooter(`E!inv`);

    message.channel.send(Gayembed);
  } else if (message.content === 'E!howdumb') {
    if (message.author.id === '713417830841712741') {
      let Dumbembed2 = new Discord.MessageEmbed()
        .setTitle(`Dumb Test`)
        .setDescription(`**you are** ` + (Math.floor(Math.random() * 100) + 30) + "% dumb \n i didnt expect any **less** :grimacing:")
        .setColor('#0000FF')
        .setFooter(`E!inv`);

      message.channel.send(Dumbembed2);
    } else {
      let Dumbembed = new Discord.MessageEmbed()
        .setTitle(`Dumb Test`)
        .setDescription(`**you are** ` + (Math.floor(Math.random() * 100) + 1) + "% dumb \n i didnt expect any **less** :grimacing:")
        .setColor('#0000FF')
        .setFooter(`E!inv`);

      message.channel.send(Dumbembed);
    }
  }
});
