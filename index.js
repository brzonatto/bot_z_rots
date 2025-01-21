const {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  EmbedBuilder
} = require("discord.js");
const cron = require("node-cron");
const serverLogs = require("./serverLogs");
const tasks = require("./tasks.js");
const rotsApi = require("./data/rotsApi.js");
const db = require('./data/db.js')
const { performance } = require('perf_hooks');

// dotenv
const dotenv = require("dotenv");
dotenv.config();
const { TOKEN, CHANNEL_SERVER_LOGS_ID } = process.env;

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

  cron.schedule('*/15 * * * * *', async () => {
    if (isRunning) return;

    isRunning = true;
    
    const startTime = performance.now();

    try {
      const channelDeaths = client.channels.cache.get(CHANNEL_SERVER_LOGS_ID);
      const deathsLog = await serverLogs.compareDeaths();
      console.log(`Total de mortes detectadas: ${deathsLog.length}`);

      if (deathsLog.length > 0) {
        if (channelDeaths) {
          for (const log of deathsLog) {
            const embed = new EmbedBuilder()
              .setColor(log.pvp_type === 'Ally' ? '#00FF00' : '#FF0000') // Verde para Ally, Vermelho para Enemy
              .setTitle(log.pvp_type === 'Ally' ? 'ALLY DIED' : 'ENEMY DIED') // Título
              .setDescription(
                `[${log.name}](https://saiyansreturn.com/profile/${log.id}?server=Universe%20Beerus) - Killed by ${log.death.is_player == 1 ? `[${log.death.killed_by}](http://teste.com.br)` : log.death.killed_by} and ${log.death.mostdamage_by == 1 ? `[${log.death.mostdamage_by}](http://teste.com.br)` : log.death.mostdamage_by}`
              )

            await channelDeaths.send({ embeds: [embed] });
          }
        } else {
          console.error(
            'Canal não encontrado. Verifique se CHANNEL_SERVER_LOGS_ID está correto no arquivo .env.'
          );
        }
      }

      // Atualiza todos os jogadores
      const allPlayers = await rotsApi.findAllPlayers();
      await db.updatePlayers(allPlayers);
    } catch (error) {
      console.error('Erro durante a execução do cron:', error);
    } finally {
      const endTime = performance.now(); // Marca o fim da execução
      const executionTime = (endTime - startTime) / 1000; // Calcula o tempo em segundos
      console.log(`Ciclo do cron concluído em ${executionTime.toFixed(2)} segundos.`);
      isRunning = false;
    }
  });

  //tasks(client)

  // cron.schedule('*/15 * * * * *', async () => {
  //     const allPlayers = await rotsApi.findAllPlayers()
  //     await db.updatePlayers(allPlayers)

  //     const channelDeaths = client.channels.cache.get(CHANNEL_SERVER_LOGS_ID)
  //     const channelLevels = client.channels.cache.get(CHANNEL_SERVER_LOGS_ID)
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
