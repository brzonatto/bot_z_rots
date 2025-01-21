const {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
} = require("discord.js");
const cron = require("node-cron");
const serverLogs = require("./serverLogs");
const tasks = require("./tasks.js");
const rotsApi = require("./data/rotsApi.js");
const db = require('./data/db.js')

// dotenv
const dotenv = require("dotenv");
dotenv.config();
const { TOKEN, CHANNEL_UPLEVEL_LOGS_ID, CHANNEL_DEATHS_LOGS_ID } = process.env;

// commands import
const fs = require("node:fs");
const path = require("node:path");
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `The command located in folder ${filePath} is missing 'data' or 'execute'!`
    );
  }
}

let isRunning = false;

// Bot Login
client.once(Events.ClientReady, (readyClient) => {
  console.log(`${readyClient.user.tag} is Ready!`);

  cron.schedule("*/15 * * * * *", async () => {
    if (isRunning) return;

    isRunning = true

    try {
      const allPlayers = await rotsApi.findAllPlayers();
      await db.updatePlayers(allPlayers);
    } catch (error) {
      console.error(error);
    } finally {
        isRunning = false
    }
  });

  //tasks(client)

  // cron.schedule('*/15 * * * * *', async () => {
  //     const allPlayers = await rotsApi.findAllPlayers()
  //     await db.updatePlayers(allPlayers)

  //     const channelDeaths = client.channels.cache.get(CHANNEL_DEATHS_LOGS_ID)
  //     const channelLevels = client.channels.cache.get(CHANNEL_DEATHS_LOGS_ID)
  //     if (channelLevels) {
  //         const upLevelsLog = await serverLogs.compareLevel()

  //         for (const log of upLevelsLog) {
  //             const card = utils.makeLevelUpCard(log)

  //             await channelLevels.send({ embeds: [card] })
  //         }
  //     } else {
  //         console.error('Canal não encontrado. Verifique se CHANNEL_SERVER_LOGS_ID está correto no arquivo .env.')
  //     }

  //     if (channelDeaths) {
  //         const deathsLog = await serverLogs.compareDeath()

  //         for (const log of deathsLog) {
  //             const card = utils.makeLevelUpCard(log)

  //             await channelDeaths.send({ embeds: [card] })
  //         }
  //     } else {
  //         console.error('Canal não encontrado. Verifique se CHANNEL_SERVER_LOGS_ID está correto no arquivo .env.')
  //     }
  // })
});

client.login(TOKEN);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error("Comando não encontrado");
    return;
  }

  try {
    // Chama o comando e executa a interação
    await command.execute(interaction);
  } catch (error) {
    console.error("Erro ao executar o comando:", error);

    // Garante que o erro seja tratado sem causar problemas com a interação
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'Houve um erro ao processar o comando!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'Houve um erro ao processar o comando!',
        ephemeral: true,
      });
    }
  }
});
