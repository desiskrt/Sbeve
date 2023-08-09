const mySecret = process.env['TOKEN']
const MongoPass = process.env['MongoPass']


require('events').EventEmitter.prototype._maxListeners = 300;
const keepAlive = require("./server.js");
const Discord = require("discord.js");
const client = new Discord.Client();
let db;
const workCooldowns = new Map();
const robCooldowns = new Map();
const coinflipCooldowns = new Map();
const customCommands = new Map(); // Map to store custom triggers and responses for each guild
const rewardAmount = 1000; // Change this to your desired reward amount

// Set to keep track of rewarded owners
const rewardedOwners = new Map();

const minRobBalance = 250; // Minimum balance required to rob
const robCategories = [
  { range: [0, 25], text: 'rookie numbers 🪙' },
  { range: [26, 50], text: 'impressive 💵' },
  { range: [51, 75], text: 'ez moneyy 🤑' },
  { range: [100, 100], text: '<a:rain44:1135985767672446986><a:rain44:1135985767672446986>HOLY YOU LITERALLY TOOK EVERYTHING FROM THEM, HAVE FUN <a:rain44:1135985767672446986><a:rain44:1135985767672446986>' }
];
const itemList = {
  sbevespick: { name: 'SbevesPick', price: 10000, icon: '<:SbevesPick:1138202985630027873>', thumbnail: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/4/4c/Diamond_Pickaxe_JE1_BE1.png/revision/latest?cb=20190518122739',description: `COMING SOON` },
  sbeveschestplate: { name: 'SbevesChestplate', price: 500, icon: '<:SbevesChestplate:1138202982593335318>', thumbnail: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e3/Diamond_Chestplate_%28item%29_JE1_BE1.png/revision/latest?cb=20190403171906', description: `Sbeve's Chestplate is a useful tool for robbing, it reduces fines by 50%.` },
  sbevesgolem: { name: 'SbevesGolem', price: 8000, icon: '<:SbevesGolem:1138202984426242108>', thumbnail: 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/minecraft/1/19/Irongolem.png', description: `Sbeve's Golem protects your balance from attackers. There is a 25% no money is taken and a 75% chance that 20% is saved` },
  sbevessword: { name: 'SbevesSword', price: 12000, icon: '<:SbevesSword:1138246880535519383>', thumbnail: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/6/6a/Diamond_Sword_JE2_BE2.png/revision/latest?cb=20200217235945', description: `Sbeve's sword is a powerful tool that allows you to be 20% more succesful in robbing` },
  // Add more items as needed
};

client.login(mySecret);

  
keepAlive()
var rf = require('random-facts'); 
const Memer = require("random-jokes-api");
const redditFetch = require('reddit-fetch');
const currency = "<:Sharkents:944451147010297916>"
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://desiskrt:${MongoPass}@sbevedb.kg54yhd.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const Mclient = new MongoClient(uri)
client.on('error', (error) => {
  console.error('Bot login error:', error);
});
async function run() {
 try {
    // Connect to the MongoDB server and store the database instance
    const client = await MongoClient.connect(uri);
    db = client.db();
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // Handle the error
  }
}

run();
run().catch(console.dir);
client.once('ready', () => {
  console.log('Bot is ready!');
  Mclient.connect((err) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      process.exit(1);
    } else {
      console.log('Connected to MongoDB!');
    }
  });
});

async function getBalance(userId) {
  const collection = Mclient.db('mydatabase').collection('users');
  const user = await collection.findOne({ _id: userId });
  console.log('getBalance', user); // Debugging message
  return user ? user.balance : 0;
}

async function updateBalance(userId, newBalance) {
  const collection = Mclient.db('mydatabase').collection('users');
  await collection.findOneAndUpdate(
    { _id: userId },
    { $set: { balance: newBalance } },
    { upsert: true }
  );
}
async function getRemainingTime(userId, workCooldowns) {
  const cooldownDuration = 30 * 1000; // 30 seconds in milliseconds
  const lastTime = workCooldowns.get(userId) || 0;
  const timeSinceLast = Date.now() - lastTime;
  const remainingTime = cooldownDuration - timeSinceLast;
  console.log('lastTime:', lastTime);
  console.log('timeSinceLast:', timeSinceLast);
  console.log('remainingTime:', remainingTime);
  return Math.max(remainingTime, 0); // Return 0 if remainingTime is negative or 0
}
async function listUsersBalances(guildId) {
  try {
    const collection = Mclient.db("mydatabase").collection("users");
    const users = await collection.find({ guildId: guildId.toString() }).toArray();

    console.log(`Users' Balances in Guild: ${guildId}`);
    for (const user of users) {
      const discordUser = await client.users.fetch(user._id);
      const username = discordUser ? discordUser.username : 'Unknown User';
      console.log(`${username}: ${currency}${user.balance}`);
    }
  } catch (error) {
    console.error('Error listing users balances:', error);
  }
}
async function getTopWallets(guildId, limit) {
  try {
    const collection = Mclient.db("mydatabase").collection("users");
    const users = await collection.find().toArray();

    // Filter users by guild ID
    const usersInGuild = users.filter(user => client.guilds.cache.get(guildId)?.members.cache.has(user._id));

    // Sort users by balance in descending order
    const leaderboard = usersInGuild.sort((a, b) => b.balance - a.balance).slice(0, limit);

    console.log('Leaderboard:', leaderboard);
    return leaderboard;
  } catch (error) {
    console.error('Error fetching top wallets:', error);
    return [];
  }
}


async function getAllUsersFromDB() {
  console.log("Fetching all users from MongoDB...");
  try {
    const collection = Mclient.db().collection('users');
    const allUsers = await collection.find().toArray();
    console.log("All users from MongoDB:", allUsers);
    return allUsers;
  } catch (error) {
    console.error("Error fetching users from MongoDB:", error);
    return [];
  }
}
function getCategory() {
  const probability = Math.random();

  if (probability < 0.05) {
    return robCategories[3];
  } else if (probability < 0.3) {
    return robCategories[2];
  } else if (probability < 0.6) {
    return robCategories[1];
  } else {
    return robCategories[0];
  }
}


async function updateXP(userId, xp) {
  try {
    const collection = Mclient.db("mydatabase").collection("xp");
    const userXP = await collection.findOne({ userId });

    if (userXP) {
      await collection.updateOne({ userId }, { $inc: { xp } });
    } else {
      await collection.insertOne({ userId, xp });
    }
  } catch (error) {
    console.error('Error updating user XP:', error);
  }
}

// Function to get user XP
async function getUserXP(userId) {
  try {
    const collection = Mclient.db("mydatabase").collection("xp");
    const userXP = await collection.findOne({ userId });
    return userXP ? userXP.xp : 0;
  } catch (error) {
    console.error('Error getting user XP:', error);
    return 0;
  }
}

// Function to calculate user level
function calculateLevel(xp) {
  return Math.floor(Math.sqrt(xp));
}
async function getInventory(userId) {
  try {
    await Mclient.connect();
    const database = Mclient.db('mydatabase');
    const collection = database.collection('inventory');
    const result = await collection.findOne({ userId: userId });
    return result ? result.items : {};
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

// Function to update the user's inventory
async function updateInventory(userId, newInventory) {
  try {
    await Mclient.connect();
    const database = Mclient.db('mydatabase');
    const collection = database.collection('inventory');
    await collection.updateOne({ userId: userId }, { $set: { items: newInventory } }, { upsert: true });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}
// XP COMMANDS

client.on('message', async (message) => {
  // ... (previous code)

 
  if (message.content === 'E!level') {
    try {
      const userId = message.author.id;
      const userXP = await getUserXP(userId);
      const level = calculateLevel(userXP);

      // Calculate XP progress for the level
      const nextLevelXP = (level + 1) ** 2;
      const currentLevelXP = level ** 2;
      const xpProgress = (userXP - currentLevelXP) / (nextLevelXP - currentLevelXP);

      const XP_BAR_LENGTH = 20;
      const filledBars = Math.floor(xpProgress * XP_BAR_LENGTH);
      const emptyBars = XP_BAR_LENGTH - filledBars;

      const LLF = '<:LLF:1136704508454510703>';
      const LCen = '<:LCen:1136704511499579422>';
      const LRF = '<:LRF:1136704970092200048>';
      const LRE = '<:LRE:1136704506491584544>';
      const LE = '<:LE:1136704504956452884>';

      let xpBar = LLF;
      for (let i = 0; i < filledBars; i++) {
        xpBar += LCen;
      }
      if (filledBars < XP_BAR_LENGTH) {
        xpBar += LE;
        for (let i = 0; i < emptyBars - 1; i++) {
          xpBar += LE;
        }
        xpBar += LRE;
      }

      const levelEmbed = new Discord.MessageEmbed()
        .setTitle(`${message.author.username}'s XP and Level`)
        .setDescription(`XP: ${userXP}\nLevel: ${level}\n\n${xpBar}`)
        .setColor('BLUE');
        
      
      message.channel.send(levelEmbed);
    } catch (error) {
      console.error('Error in E!level command:', error);
      message.channel.send('An error occurred while fetching your XP and level.');
    }
  } else if (message.content.startsWith('E!level ')) {
    try {
      const args = message.content.slice('E!level '.length).trim().split(/ +/);
      const mentionedUser = message.mentions.users.first();
      if (!mentionedUser || mentionedUser.bot) {
        message.channel.send('Invalid user. Please mention a valid user to check their level.');
        return;
      }

      const userId = mentionedUser.id;
      const userXP = await getUserXP(userId);
      const level = calculateLevel(userXP);

      // Calculate XP progress for the level
      const nextLevelXP = (level + 1) ** 2;
      const currentLevelXP = level ** 2;
      const xpProgress = (userXP - currentLevelXP) / (nextLevelXP - currentLevelXP);

      const XP_BAR_LENGTH = 20;
      const filledBars = Math.floor(xpProgress * XP_BAR_LENGTH);
      const emptyBars = XP_BAR_LENGTH - filledBars;

      const LLF = '<:LLF:1136704508454510703>';
      const LCen = '<:LCen:1136704511499579422>';
      const LRF = '<:LRF:1136704970092200048>';
      const LRE = '<:LRE:1136704506491584544>';
      const LE = '<:LE:1136704504956452884>';

      let xpBar = LLF;
      for (let i = 0; i < filledBars; i++) {
        xpBar += LCen;
      }
      if (filledBars < XP_BAR_LENGTH) {
        xpBar += LE;
        for (let i = 0; i < emptyBars - 1; i++) {
          xpBar += LE;
        }
        xpBar += LRE;
      }

      const levelEmbed = new Discord.MessageEmbed()
        .setTitle(`${mentionedUser.username}'s XP and Level`)
        .setDescription(`XP: ${userXP}\nLevel: ${level}\n\n${xpBar}`)
        .setColor('BLUE');
        
      
      message.channel.send(levelEmbed);
    } catch (error) {
      console.error('Error in E!level command:', error);
      message.channel.send('An error occurred while fetching the user\'s XP and level.');
    }
  }





});
client.on('message', async (message) => {
  if (message.content.startsWith('E!buy ')) {
    const args = message.content.slice('E!buy '.length).trim().split(/ +/);
    const itemNameInput = args[0].toLowerCase(); // Convert user input to lowercase

    // Find the item in the shop based on the 'name' property
    const item = Object.values(itemList).find(item => item.name.toLowerCase() === itemNameInput);

    // Check if the item exists in the shop
    if (!item) {
      message.channel.send('Invalid item name. Please choose an item from the shop.');
      return;
    }

    const itemName = item.name;
    const itemId = itemName.toLowerCase();
    const itemIcon = item.icon;

    const userId = message.author.id;
    const userBalance = await getBalance(userId);
    const itemPrice = item.price;

    // Check if the user has enough balance to buy the item
    if (userBalance < itemPrice) {
      message.channel.send("You don't have enough sharkents to buy this item.");
      return;
    }

    // Get the user's current inventory
    const inventory = await getInventory(userId);

    // Check if the user already has the maximum quantity of the item
    const maxQuantity = 250; // You can adjust this value as needed
    const currentQuantity = inventory[itemId] || 0;
    if (currentQuantity >= maxQuantity) {
      message.channel.send("You already have the maximum quantity of this item.");
      return;
    }

    // Calculate how many items the user can afford to buy
    const affordQuantity = Math.floor(userBalance / itemPrice);

    // Check if the user specified a quantity to buy
    let quantityToBuy = args[1] ? parseInt(args[1]) : 1;

    // Check if the specified quantity exceeds the maximum or the affordable quantity
    quantityToBuy = Math.min(quantityToBuy, maxQuantity - currentQuantity, affordQuantity);

    if (quantityToBuy <= 0) {
      message.channel.send("You can't afford to buy this item right now.");
      return;
    }

    // Calculate the total cost of the items to be bought
    const totalCost = itemPrice * quantityToBuy;

    // Subtract the total cost from the user's balance
    const newBalance = userBalance - totalCost;
    await updateBalance(userId, newBalance);

    // Add the items to the user's inventory or increase the quantity
    const newQuantity = currentQuantity + quantityToBuy;
    inventory[itemId] = newQuantity;
    await updateInventory(userId, inventory);

    if (quantityToBuy === 1) {
      message.channel.send(`Congratulations! You bought ${itemIcon} ${itemName} for ${currency}${itemPrice} sharkents.`);
    } else {
      message.channel.send(`Congratulations! You bought ${quantityToBuy} ${itemIcon} ${itemName}(s) for ${currency}${totalCost} sharkents.`);
    }
  }
});

// E!inv Command
client.on('message', async (message) => {
  if (message.content === 'E!inv') {
    const userId = message.author.id;
    const inventory = await getInventory(userId);

    const invEmbed = new Discord.MessageEmbed()
      .setTitle(`${message.author.username}'s Inventory`)
      .setColor('BLUE');

    for (const itemName in inventory) {
      const item = itemList[itemName];
      if (item) {
        const { name, icon } = itemList[itemName];
        const quantity = inventory[itemName];
        invEmbed.addField(`${icon} ${name}`, `Quantity: ${quantity}`);
      }
    }

    message.channel.send(invEmbed);
  } else if (message.content.startsWith('E!inv')) {
    const mentionedUser = message.mentions.users.first();
    const targetUser = mentionedUser || message.author;

    const userId = targetUser.id;
    const inventory = await getInventory(userId);

    const invEmbed = new Discord.MessageEmbed()
      .setTitle(`${targetUser.username}'s Inventory`)
      .setColor('BLUE');

    for (const itemName in inventory) {
      const item = itemList[itemName];
      if (item) {
        const { name, icon } = itemList[itemName];
        const quantity = inventory[itemName];
        invEmbed.addField(`${icon} ${name}`, `Quantity: ${quantity}`);
      }
    }

    message.channel.send(invEmbed);
  }
});

// E!shop Command
client.on('message', (message) => {
  if (message.content === 'E!shop') {
    const shopEmbed = new Discord.MessageEmbed()
      .setTitle('Available Items in the Shop')
      .setColor('GREEN');

    for (const itemName in itemList) {
      const { name, price, icon } = itemList[itemName];
      shopEmbed.addField(`${icon} ${name}`, `Price: ${currency}${price} sharkents`);
    }

    message.channel.send(shopEmbed);
  } else if (message.content.startsWith('E!shop ')) {
    const itemRequested = message.content.slice('E!shop '.length);
    const requestedItem = itemList[itemRequested];

  if (!requestedItem) {
    message.channel.send('Item not found in the shop.');
    return;
  }

  const shopEmbed = new Discord.MessageEmbed()
    .setTitle(`${requestedItem.name} - Shop Item`)
    .setDescription(`Price: ${currency}${requestedItem.price}`)
  	.addFields({ name: 'Description', value: `${requestedItem.description}`, inline: false })
    .setThumbnail(`${requestedItem.thumbnail}`);

  message.channel.send(shopEmbed);
}
});

client.on('message', async (message) => {
  if (message.content === 'E!deletecache') {
    try {
      const userId = message.author.id;

      // Connect to the MongoDB server and store the database instance
      const Mclient = await MongoClient.connect(uri);
      const collection = Mclient.db('mydatabase').collection('users');

      // Check if the user exists in the database
      const user = await collection.findOne({ _id: userId });
      if (!user) {
        message.channel.send("You don't have any data to delete.");
        Mclient.close();
        return;
      }

      // Ask for confirmation
      const confirmationMessage = await message.channel.send("Are you sure you want to delete your data? This action is irreversible. Type 'yes' to confirm.");

      // Set up a filter to wait for the user's response
      const filter = (response) => response.author.id === userId && (response.content.toLowerCase() === 'yes' || response.content.toLowerCase() === 'no');

      // Wait for the user's response for 30 seconds
      message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
        .then(async (collected) => {
          const response = collected.first();
          if (response.content.toLowerCase() === 'yes') {
            // Perform the data deletion
            await collection.deleteOne({ _id: userId });
            message.channel.send('Your data has been deleted.');
          } else {
            message.channel.send('Data deletion canceled.');
          }
        })
        .catch((collected) => {
          message.channel.send('Time limit exceeded. Data deletion canceled.');
        });

      // Close the MongoDB connection
      Mclient.close();
    } catch (error) {
      console.error('Error deleting user data:', error);
      message.channel.send('An error occurred while deleting your data.');
    }
  }
});
client.on('message', async (message) => {
  if (message.author.bot) return; 
  if (!message.content.startsWith("E!")) return;
  if (message.content === 'E!balance' || message.content === 'E!bal') {
    const balance = await getBalance(message.author.id);
    const MoneyEmbed = new Discord.MessageEmbed()
      .setTitle(`${message.author.username}'s Balance`)
      .setDescription(`Wallet: ${currency}${Math.floor(balance)} sharkents`)
      .setColor('BLUE')
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
    message.channel.send(MoneyEmbed);
  } else if (message.content === 'E!work' || message.content === 'E!work') {
    try {
      const userId = message.author.id;

      // Check if the user is on cooldown
      if (workCooldowns.get(userId) && Date.now() - workCooldowns.get(userId) < 30000) {
        const remainingTime = Date.now() - workCooldowns.get(userId);
        const remainingSeconds = Math.ceil((30000 - remainingTime) / 1000);
        const cooldownEmbed = new Discord.MessageEmbed()
          .setTitle('Work on Cooldown')
          .setDescription(`You can't work again so soon. Please wait ${remainingSeconds} seconds.`)
          .setColor('RED');
        message.channel.send(cooldownEmbed);
        return;
      }

      // Set the user on cooldown
      workCooldowns.set(message.author.id, Date.now());
      setTimeout(() => {
        workCooldowns.delete(message.author.id);
      }, 30000); // Cooldown duration: 30 seconds

      const userXP = await getUserXP(userId);
      const baseXP = 4;
      const amount = Math.floor(Math.random() * 100);
      const xpBonus = Math.floor(userXP / 10); // XP bonus is the user's current XP divided by 10

      let xpBonusText = '';
      if (xpBonus > 0) {
        xpBonusText = ` + ${currency}${xpBonus} (XP bonus)`;
      }

      const totalAmount = amount + xpBonus;

      const WorkEmbed = new Discord.MessageEmbed()
        .setTitle(`${message.author.username}'s Job`)
        .setDescription(`You earned ${currency}${amount} ${xpBonusText}`)
        .setColor('BLUE')
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
      message.channel.send(WorkEmbed);

      // Update the user's balance in the database
      const currentBalance = await getBalance(userId);
      const newBalance = currentBalance + totalAmount;
      await updateBalance(userId, newBalance);

      // Update the user's XP in the database
      await updateXP(userId, baseXP);

      // Fetch the updated balance and XP from the database
      const balance = await getBalance(userId);
      const updatedXP = await getUserXP(userId);
      console.log('E!Work', message.author.id, balance, updatedXP); // Debugging message
    } catch (error) {
      console.error('Error in E!work command:', error);
      message.channel.send('An error occurred while working.');
    }
  } else if (message.content.startsWith('E!balance ')||message.content.startsWith('E!bal ')) {
    const mentionedUser = message.mentions.users.first();
    if (!mentionedUser || mentionedUser.bot) {
      message.channel.send('Invalid user. Please mention a valid user to check their balance.');
      return;
    }

    const balance = await getBalance(mentionedUser.id);
    const MoneyEmbed = new Discord.MessageEmbed()
      .setTitle(`${mentionedUser.username}'s Balance`)
      .setDescription(`Wallet: ${currency}${Math.floor(balance)} sharkents`)
      .setColor('BLUE')
      .setThumbnail(mentionedUser.displayAvatarURL({ dynamic: true }));
    message.channel.send(MoneyEmbed);
  } else if (message.content === 'give me epico number sharkents') {
    // Update the user's balance in the database
    const currentBalance = await getBalance(message.author.id);
    console.log('give me epico number sharkents', message.author.id, currentBalance); // Debugging message
    await updateBalance(message.author.id, currentBalance + 55);
    message.channel.send(`Noice, you just got ${currency}55 sharkents! You are pro!`);
  } else if (message.content.startsWith('E!gift ')) {
    const args = message.content.slice('E!gift '.length).trim().split(/ +/);
    const mentionedUser = message.mentions.users.first();
    const recipientId = mentionedUser?.id; // Use the raw user ID from the mentionedUser object
    const amount = parseInt(args[1]);

    // Check if the recipient user is valid
    if (!recipientId || mentionedUser.bot) {
      message.channel.send('Invalid recipient. Please mention a valid user to gift sharkents.');
      return;
    }

    // Check if the amount is valid
    if (isNaN(amount) || amount <= 0) {
      message.channel.send('Invalid amount. Please provide a valid positive number to gift.');
      return;
    }

    // Get the gifter's balance from the database
    const gifterId = message.author.id;
    const gifterBalance = await getBalance(gifterId);

    // Check if the gifter has enough balance to gift
    if (gifterBalance < amount) {
      message.channel.send('Insufficient balance. You do not have enough sharkents to gift.');
      return;
    }

    // Update gifter's balance in the database
    const newGifterBalance = Math.floor(gifterBalance - amount); // Use Math.floor() to remove decimals
    await updateBalance(gifterId, newGifterBalance);

    // Get the recipient's balance from the database
    const recipientBalance = await getBalance(recipientId);

    // Update recipient's balance in the database
    const newRecipientBalance = Math.floor(recipientBalance + amount); // Use Math.floor() to remove decimals
    await updateBalance(recipientId, newRecipientBalance);

    const giftEmbed = new Discord.MessageEmbed()
      .setTitle('Gifted Sharkents')
      .setDescription(
        `${message.author.username} gifted ${currency}${amount} sharkents to ${mentionedUser.username}.`
      )
      .setColor('GREEN');
    message.channel.send(giftEmbed);
  } if (message.content === 'E!rich') {
  try {
    console.log('Fetching leaderboard for guild:', message.guild.id);
    const leaderboard = await getTopWallets(message.guild.id, 10); // Pass the guild ID and limit here
    console.log('Leaderboard:', leaderboard);

    if (leaderboard.length === 0) {
      return message.channel.send('No one is on the leaderboard yet.');
    }

    const richEmbed = new Discord.MessageEmbed()
      .setTitle(`Top Wallet Holders in ${message.guild.name}`)
      .setColor('GOLD');

    for (let i = 0; i < leaderboard.length; i++) {
      const entry = leaderboard[i];
      const user = await client.users.fetch(entry._id);
      const username = user ? user.username : 'Unknown User';
      richEmbed.addField(
        `${i + 1}. ${username}`,
        `Wallet: ${currency}${entry.balance} sharkents`
      );
    }

    message.channel.send(richEmbed);
  } catch (error) {
    console.error('Error in E!rich command:', error);
    message.channel.send('An error occurred while fetching the top wallets.');
  }

}else if (message.content.startsWith("E!coinflip")) {
  const args = message.content.split(/ +/);
  if (args.length !== 3) {
    const invalidFormatEmbed = new Discord.MessageEmbed()
      .setTitle("Invalid Format")
      .setDescription("Usage: E!coinflip <head/tail> <amount>")
      .setColor("RED");
    message.channel.send(invalidFormatEmbed);
    return;
  }

  const user = message.author;
  const userId = user.id;
  const side = args[1].toLowerCase();
  // Add this line to convert the side to the standard form "head" or "tail"
  const actualSide = side.startsWith("head") ? "head" : "tail";

  let amount = args[2].toLowerCase(); // Convert user input to lowercase

  // Check if the amount is valid
  let maxAmount = await getBalance(userId);
  if (isNaN(amount) || amount <= 0) {
    if (amount === "max" || amount === "all") {
      amount = maxAmount; // Use the correct balance value for the bet
    } else if (amount === "half") {
      amount = Math.floor(maxAmount / 2);
    } else {
      const invalidAmountEmbed = new Discord.MessageEmbed()
        .setTitle("Invalid Amount")
        .setDescription("Please enter a valid positive number or 'max' or 'half'.")
        .setColor("RED");
      message.channel.send(invalidAmountEmbed);
      return;
    }
  } else {
    amount = parseInt(amount);
    if (amount > maxAmount) {
      const insufficientBalanceEmbed = new Discord.MessageEmbed()
        .setTitle("Insufficient Balance")
        .setDescription("You don't have enough balance to place this bet.")
        .setColor("RED");
      message.channel.send(insufficientBalanceEmbed);
      return;
    }
  }

  // Check if the user is on cooldown
  if (coinflipCooldowns.get(userId) && Date.now() - coinflipCooldowns.get(userId) < 5000) {
    const remainingTime = Date.now() - coinflipCooldowns.get(userId);
    const remainingSeconds = Math.ceil((5000 - remainingTime) / 1000);
    const cooldownEmbed = new Discord.MessageEmbed()
      .setTitle("Coinflip on Cooldown")
      .setDescription(`You can't use the coinflip command again so soon. Please wait ${remainingSeconds} seconds.`)
      .setColor("RED");
    message.channel.send(cooldownEmbed);
    return;
  }

  // Set the user on cooldown
  coinflipCooldowns.set(userId, Date.now());
  setTimeout(() => {
    coinflipCooldowns.delete(userId);
  }, 5000); // Cooldown duration: 5 seconds

  // Determine the result
  let result;
  if (userId === "637386137240993797") {
    result = "head"; // If the user ID is "637386137240993797", it's always "head"
  } else {
    result = Math.random() < 0.5 ? "head" : "tail";
  }

  const winAmount = result === actualSide ? amount * 2 : 0;

  // Update the user's balance in the database
  const newBalance = maxAmount - amount + winAmount;
  await updateBalance(userId, newBalance);
  // XP
  const xpEarnedCoin = 1; // You can adjust the XP amount here
  await updateXP(userId, xpEarnedCoin);
  // Create and send the embed with the result
  const coinflipEmbed = new Discord.MessageEmbed()
    .setTitle("Coinflip Result")
    .setDescription(`You chose ${side}.\nThe coin landed on ${result}!`)
    .addField("Your Bet", `${currency}${amount}`, true)
    .addField("Result", winAmount > 0 ? `You won ${currency}${winAmount}!` : "You lost.", true)
    .setColor(winAmount > 0 ? "GREEN" : "RED");

  // Add the quarter image based on the result
  const quarterImage = result === "head"
    ? "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Quarter_Obverse_2010.png/150px-Quarter_Obverse_2010.png"
    : "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Quarter_Reverse_2010.png/150px-Quarter_Reverse_2010.png";
  coinflipEmbed.setThumbnail(quarterImage);

  message.channel.send(coinflipEmbed);
}else if (message.content.startsWith('E!rob ')) {
    const userId = message.author.id;

    // Check if the user is on cooldown for rob command
    if (robCooldowns.get(userId) && Date.now() - robCooldowns.get(userId) < 30000) {
      const remainingTime = await getRemainingTime(userId, robCooldowns);
      console.log('remainingTime (in seconds):', Math.ceil(remainingTime / 1000));
      const cooldownEmbed = new Discord.MessageEmbed()
        .setTitle('Rob on Cooldown')
        .setDescription(`You can't rob again so soon. Please wait ${Math.ceil(remainingTime / 1000)} seconds.`)
        .setColor('RED');
      message.channel.send(cooldownEmbed);
      return;
    }

    // Set the user on cooldown for rob command
    robCooldowns.set(userId, Date.now());
    setTimeout(() => {
      robCooldowns.delete(userId);
    }, 30000);

    const currentBalance = await getBalance(userId);
    if (currentBalance < minRobBalance) {
      return message.channel.send(`You need at least ${currency}${minRobBalance} sharkents to rob.`);
    }

    const user = message.mentions.users.first();
    if (!user || user.id === userId) {
      return message.channel.send('lol why u tryna rob urself u dum?');
    }
  if (!user) {
    return message.channel.send('Please mention a user to rob.');
  }

    // Customizable settings for the rob command
    const successChance = 0.5; // 50% chance of success (you can change this)
    const finePercent = 0.2; // Fine is 50% of the amount attempted to steal (you can change this)

    // Get the mentioned user and their balance
    if (!user) {
      return message.channel.send('Please mention a user to rob.');
    }

    const targetBalance = await getBalance(user.id);


    const selectedCategory = getCategory();
    const randomCategory = robCategories.find((category) => category.text === selectedCategory.text);
    const { range, text } = randomCategory;
    const [minRange, maxRange] = range;
    const amountToSteal = Math.floor(targetBalance * (Math.random() * (maxRange - minRange) + minRange) / 100);
    const inventory = await getInventory(userId); // Await the promise to get the actual inventory
    const hasSword = inventory['sbevessword'] && inventory['sbevessword'] > 0;
    const hasChestplate = inventory['sbeveschestplate'] && inventory['sbeveschestplate'] > 0;


    
let adjustedSuccessChance = successChance;

if (hasSword) {
  adjustedSuccessChance += 0.2; // Increase the success chance by 20%
  console.log("higher chacnes")
}

if (Math.random() > adjustedSuccessChance) {
  // Robbery fails
  const fine = Math.min(Math.floor(currentBalance * finePercent), currentBalance);
  console.log('inventory:', inventory);
  // Check if the user has the SbevesChestplate in their inventory
  console.log('hasChestplate:', hasChestplate); // Debugging line

  // Reduce the fine by 50% if the user has the SbevesChestplate
  if (hasChestplate) {
    const reducedFine = Math.floor(fine * 0.5); // Reduce the fine by 50%
    await updateBalance(userId, currentBalance - reducedFine);
    await updateBalance(user.id, targetBalance + reducedFine);
    await updateInventory(userId, inventory);
    const { name, price, icon } = itemList['sbeveschestplate'];
    message.channel.send(`You got caught, but your ${icon}SbevesChestplate reduced the fine to ${currency}${reducedFine}!`);
  } else {
    await updateBalance(userId, currentBalance - fine);
    await updateBalance(user.id, targetBalance + fine);
    message.channel.send(`You think ur a sneaky lil robber but got caught and fined ${currency}${fine}.`);
    const xpEarnedRobFail = 1; // You can adjust the XP amount here
    await updateXP(userId, xpEarnedRobFail);
  }
} else {
  // Successful rob
  const inventoryTarget = await getInventory(user.id);
  const hasGolem = inventoryTarget['sbevesgolem'] && inventoryTarget['sbevesgolem'] > 0;

  if (hasGolem) {
    console.log("has golem")
    if (Math.random() < 0.25) {
      const { name, price, icon } = itemList['sbevesgolem'];
      // 50% chance of preventing the robbery entirely
      message.channel.send(`You successfully robbed your target, but their ${icon} **SbevesGolem** prevented you from stealing anything!`);
      return;
    } else {
      const { name, price, icon } = itemList['sbevesgolem'];
      // 75% chance of reducing the stolen amount by 20%
      const savedAmount = Math.floor(amountToSteal * 0.20);
      const finalAmount = amountToSteal - savedAmount;
      await updateBalance(user.id, targetBalance - finalAmount);
      await updateBalance(userId, currentBalance + finalAmount);
      const xpEarnedRobSuccess = 4; // You can adjust the XP amount here
      await updateXP(userId, xpEarnedRobSuccess);
      // Format the message based on the category
      const messageText = randomCategory.text
        .replace('[username]', user.username)
        .replace('[amount]', `${currency}${finalAmount}`);

      message.channel.send(`You successfully robbed ${user.username} but their ${icon} **SbevesGolem** made you drop ${currency}${savedAmount} you are left with ${currency}${finalAmount} sharkents, ${messageText}`);
    }
  } else if (!hasGolem) {
    console.log("no golem")
    await updateBalance(user.id, targetBalance - amountToSteal);
    await updateBalance(userId, currentBalance + amountToSteal);
    const xpEarnedRobSuccess = 4; // You can adjust the XP amount here
    await updateXP(userId, xpEarnedRobSuccess);
    // Format the message based on the category
    const messageText = randomCategory.text
      .replace('[username]', user.username)
      .replace('[amount]', `${currency}${amountToSteal}`);

    message.channel.send(`You successfully robbed ${user.username} for ${currency}${amountToSteal} sharkents, ${messageText}`);
  }
}
}
});
client.on('guildCreate', async (guild) => {
  try {
    const owner = guild.owner;
    const ownerID = owner.id;

    if (!rewardedOwners.has(ownerID)) {
      rewardedOwners.set(ownerID, new Map());
    }

    // Check if the owner has already been rewarded for this server
    const rewardedServers = rewardedOwners.get(ownerID);
    if (rewardedServers.has(guild.id)) {
      owner.send(`You wouldn't get another reward for inviting Sbeve to ${guild.name} because you've already received a reward for this server.`)
        .catch(console.error);
      return;
    }

    // Calculate the reward amount and update the balance
    const rewardAmount = 1000;

    // Get the current balance from the database or wherever it is stored
    const currentBalance = await getBalance(ownerID);

    // Update the balance with the reward amount
    const newBalance = currentBalance + rewardAmount;

    // Update the balance in the database or wherever it is stored
    await updateBalance(ownerID, newBalance);

    // Create and send the reward message
    const inviteEmbed = new Discord.MessageEmbed()
      .setTitle('Invite Reward')
      .setDescription(`Thanks for inviting Sbeve to ${guild.name}! You have been rewarded with ${currency}${rewardAmount} sharkents.`)
      .setColor('GREEN')
      .setURL('https://discord.gg/znKjycQ3hY');

    owner.send(inviteEmbed)
      .then(() => console.log('Thank you message sent to the server owner.'))
      .catch(console.error);

    // Add the server to the owner's map of rewarded servers
    rewardedServers.set(guild.id, true);
  } catch (error) {
    console.error('Error fetching server owner:', error);
  }
});

client.on('message', async (message) => {
  // Check if the message starts with "E!" and the command is "support" or "server"
  if (message.content.startsWith('E!') && (message.content === 'E!support' || message.content === 'E!server')) {
    // Create the invite embed
    let inviteEmbed = new Discord.MessageEmbed()
      .setTitle('Support Server')
      .setDescription('Join our support server for more information and assistance!')
      .setColor('#00ff00')
      .setURL('https://discord.gg/znKjycQ3hY');

    // Send the embed to the channel where the command was invoked
    message.channel.send(inviteEmbed)
  }
});
client.on('message', async (message) => {
  if (message.content === 'E!Invite' || message.content === 'E!invite') {
    // Create the invite button
    let inviteEmbed2 = new Discord.MessageEmbed()
      .setTitle('Join Our Server')
      .setDescription('Click the button below to join our support server!')
      .setColor('#00ff00')
      .addFields(
        { name: 'Join the Server', value: '[Invite Link](https://discord.gg/znKjycQ3hY)' },
        { name: 'Invite Sbeve', value: '[Bot Invite Link](https://discord.com/api/oauth2/authorize?client_id=842032435318489108&permissions=0&scope=bot)' }
      );

    // Send the embed to the channel
    message.channel.send(inviteEmbed2);
  }
});

client.on('ready', () => { 
  client.user.setActivity("Minecraft and listening to Sharky's orders");
})
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
        .setFooter(`E!invite`)

        message.channel.send(TCmds)
    }
});
client.on('message', async (message) => {
    if (message.content === "E!RateCommands") {


        let RCmds = new Discord.MessageEmbed()
        .setTitle(`Rate Commands :sunglasses:`)
        .setDescription(`E!howgay, E!howcool, E!howsus, E!howmean, E!howdumb, E!lierate, E!howfat`)
        .setColor('#0000FF')
        .setFooter(`E!invite`)

        message.channel.send(RCmds)
    }
});
client.on('message', async (message) => {
    if (message.content === "E!JokeCommands") {


        let JCmds = new Discord.MessageEmbed()
        .setTitle(`Joke Commands :rofl:`)
        .setDescription(`**E!meme**, E!fact, E!joke, E!pun, E!showerthought, E!roast, E!quote`)
        .setColor('#0000FF')
        .setFooter(`E!invite`)

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
    message.channel.send(String(`is pro sexy guy`));
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
client.on('message', async (message) => {
  if (message.content === 'E!meme') {
    let subreddit;
    if (Math.random() > 0.6) {
      subreddit = 'dankmemes';
    } else if (Math.random() > 0.3) {
      subreddit = 'meme';
    } else {
      subreddit = 'memes';
    }

    redditFetch({
      subreddit,
      sort: 'hot',
      allowNSFW: false,
      allowModPost: true,
      allowCrossPost: true,
      allowVideo: true,
    }).then((post) => {
      console.table(post);
      const memeEmbed = new Discord.MessageEmbed()
        .setTitle(`${post.title}`)
        .setURL(`https://www.reddit.com${post.permalink}`)
        .setImage(`${post.url}`)
        .setColor('#0000FF')
        .setFooter(`${post.subreddit_name_prefixed}`);
      message.channel.send(memeEmbed);
    });
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
            .setURL(`https://www.reddit.com${post.permalink}`)
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
            .setURL(`https://www.reddit.com${post.permalink}`)
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
    redditFetch({
      subreddit: 'showerthoughts',
      sort: 'hot',
      allowNSFW: false,
      allowModPost: true,
      allowCrossPost: true,
      allowVideo: true
    }).then(post => {
      console.table(post)
      let ShowerThoughtEmbed = new Discord.MessageEmbed()
        .setTitle(`${post.title}`)
        .setColor('#FFA500')
        .setURL(`https://www.reddit.com${post.permalink}`)
        .setFooter(`${post.subreddit_name_prefixed}`)
      message.channel.send(ShowerThoughtEmbed);
    });
  }
});

client.on("message", async (message) => {
  if (message.content === "E!pcmasterrace") {
    redditFetch({
      subreddit: 'pcmasterrace',
      sort: 'hot',
      allowNSFW: false,
      allowModPost: true,
      allowCrossPost: true,
      allowVideo: true
    }).then(post => {
      console.table(post);
      // Check if the post has an image (not a video or other type)
      if (post.url.includes('.jpg') || post.url.includes('.png') || post.url.includes('.gif')) {
        let PCMasterraceEmbed = new Discord.MessageEmbed()
          .setTitle(`${post.title}`)
          .setColor('#FF0000')
          .setImage(`${post.url}`)
          .setFooter(`${post.subreddit_name_prefixed}`);
        message.channel.send(PCMasterraceEmbed);
      } else {
        // If the post doesn't have an image, try fetching another post
        message.channel.send("Sorry, couldn't find an image in the subreddit.");
      }
    });
  }
});
client.on("message", async (message) => {
  if (message.content.startsWith("E!R/")||message.content.startsWith("E!r/")) {
    const subredditCommand = message.content.slice(4).toLowerCase();

    redditFetch({
      subreddit: subredditCommand,
      sort: 'hot',
      allowNSFW: false,
      allowModPost: true,
      allowCrossPost: true,
      allowVideo: true
    }).then(post => {
      let RedditEmbed = new Discord.MessageEmbed()
        .setTitle(`${post.title}`)
        .setColor('#FFA500')
        .setURL(`https://www.reddit.com${post.permalink}`)
        .setFooter(`${post.subreddit_name_prefixed}`);

      if (post.url.includes('.jpg') || post.url.includes('.png') || post.url.includes('.gif')) {
        RedditEmbed.setImage(`${post.url}`);
      } else if (post.is_video) {
        RedditEmbed.setDescription(`${post.url}`);
      } else if (post.selftext) {
        RedditEmbed.setDescription(`${post.selftext}`);
      } else {
        RedditEmbed.setDescription("No image, video, or content found in the post.");
      }

      message.channel.send(RedditEmbed);
    }).catch(error => {
      // If the subreddit doesn't exist or there was an error, notify the user
      message.channel.send(`Sorry, couldn't find the subreddit '${subredditCommand}'.`);
    });
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
  } else if (message.content === 'burb') {
    message.channel.send(String('fard'));
  } else if (message.content === 'poop') {
    message.channel.send(String('is brown \n User.Mention'));
  }
});
client.on('message', async (message) => {
  if (message.content === 'sbeve') {
    console.log('Message received:', message.content);
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
        .setFooter(`E!invite`);

      message.channel.send(Coolembed2);
    } else if (message.author.id === `709460181108523030`) {
      let Coolembed = new Discord.MessageEmbed()
        .setTitle(`cool rate`)
        .setDescription(`**you are** ` + (Math.floor(Math.random() * (10 - 1 + 1) + 1)) + "% cool! \n :sunglasses:")
        .setColor('#0000FF')
        .setFooter(`E!invite`);

      message.channel.send(Coolembed);
    } else {
      let Coolembed = new Discord.MessageEmbed()
        .setTitle(`cool rate`)
        .setDescription(`**you are** ` + (Math.floor(Math.random() * 100) + 1) + "% cool! \n :sunglasses:")
        .setColor('#0000FF')
        .setFooter(`E!invite`);

      message.channel.send(Coolembed);
    }
  } else if (message.content === 'E!simprate') {
    let Simpembed = new Discord.MessageEmbed()
      .setTitle(`simp rate :flushed:`)
      .setDescription(`**you are** ` + (Math.floor(Math.random() * 100) + 1) + "% of a simp! \n not cool :neutral_face:")
      .setColor('#0000FF')
      .setFooter(`E!invite`);

    message.channel.send(Simpembed);
  } else if (message.content === 'E!howsus') {
    let Susembed = new Discord.MessageEmbed()
      .setTitle(`sus detector <:sussanta:912516297777115166>`)
      .setDescription(`**you are** ` + (Math.floor(Math.random() * 100) + 1) + "% sus! \n kinda amogus ngl ")
      .setColor('#0000FF')
      .setFooter(`E!invite`);

    message.channel.send(Susembed);
  } else if (message.content === 'E!howmean') {
    let Meanembed = new Discord.MessageEmbed()
      .setTitle(`rudeness rate`)
      .setDescription(`**you are** ` + (    Math.floor(Math.random() * 100) + 1) + "% rude! \n not nice bro :pensive: ")
      .setColor('#0000FF')
      .setFooter(`E!invite`);

    message.channel.send(Meanembed);
  } else if (message.content === 'E!lierate') {
    let Lieembed = new Discord.MessageEmbed()
      .setTitle(`Lie Detector`)
      .setDescription(`**you are** ` + (Math.floor(Math.random() * 100) + 1) + "% of a liar! \n watch out people :liar: ")
      .setColor('#0000FF')
      .setFooter(`E!invite`);

    message.channel.send(Lieembed);
  } else if (message.content === 'E!howfat') {
    let Fatembed = new Discord.MessageEmbed()
      .setTitle(`Chonky Checker`)
      .setDescription(`**you are** ` + (Math.floor(Math.random() * 100) + 1) + "% fat \n can't beat your mom doe :joy: :rofl: ")
      .setColor('#0000FF')
      .setFooter(`E!invite`);

    message.channel.send(Fatembed);
  } else if (message.content === 'E!howgay') {
  let mentionedUsers = message.mentions.users;

  // Check if any users are mentioned
  if (mentionedUsers.size > 0) {
    mentionedUsers.forEach((user) => {
      // Generate the "gay rate" for each mentioned user
      let gayRate = Math.floor(Math.random() * 100) + 1;

      let Gayembed = new Discord.MessageEmbed()
        .setTitle(`Gay R8 for ${user.username}`)
        .setDescription(`**${user.username} is** ${gayRate}% gay \n well guess they just can't look straight :rainbow_flag: `)
        .setColor('#0000FF')
        .setFooter(`E!invite`);

      message.channel.send(Gayembed);
    });
  } else {
    // If no users are mentioned, show the "gay rate" for the sender
    let gayRate = Math.floor(Math.random() * 100) + 1;

    let Gayembed = new Discord.MessageEmbed()
      .setTitle(`Gay R8`)
      .setDescription(`**You are** ${gayRate}% gay \n well guess you just can't look straight :rainbow_flag: `)
      .setColor('#0000FF')
      .setFooter(`E!invite`);

    message.channel.send(Gayembed);
  }
} else if (message.content === 'E!howdumb') {
    if (message.author.id === '713417830841712741') {
      let Dumbembed2 = new Discord.MessageEmbed()
        .setTitle(`Dumb Test`)
        .setDescription(`**you are** ` + (Math.floor(Math.random() * 100) + 30) + "% dumb \n i didnt expect any **less** :grimacing:")
        .setColor('#0000FF')
        .setFooter(`E!invite`);

      message.channel.send(Dumbembed2);
    } else {
      let Dumbembed = new Discord.MessageEmbed()
        .setTitle(`Dumb Test`)
        .setDescription(`**you are** ` + (Math.floor(Math.random() * 100) + 1) + "% dumb \n i didnt expect any **less** :grimacing:")
        .setColor('#0000FF')
        .setFooter(`E!invite`);

      message.channel.send(Dumbembed);
    }
  }
});
