const {
    Client,
    Events,
    GatewayIntentBits,
    Collection,
    EmbedBuilder,
} = require("discord.js");
const cron = require("node-cron");
const serverLogs = require("./serverLogs");
const rotsApi = require("./data/rotsApi.js");
const db = require("./data/db.js");
const { performance } = require("perf_hooks");
const utils = require("./utils.js");

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
    
    

    cron.schedule("*/15 * * * * *", async () => {
        if (isRunning) return;

        isRunning = true;

        const startTime = performance.now();

        try {
            const channelDeaths = client.channels.cache.get(
                CHANNEL_SERVER_LOGS_ID
            );
            console.log("Inicia a comparação!");
            const deathsLog = await serverLogs.compareDeaths();
            console.log("Encerra a comparação!");
            console.log(`Total de mortes detectadas: ${deathsLog.length}`);

            if (deathsLog.length > 0) {
                if (channelDeaths) {
                    for (const log of deathsLog) {
                        let randomMessage = utils.mensagemEngracadaDeMorte()
                        let playerKilledByID = null;
                        let playerMostDamageByID = null;
                        if (log.death.is_player == 1) {
                            playerKilledByID = await serverLogs.getKillerPlayer(
                                log.death.killed_by
                            );
                        }

                        if (
                            log.death.mostdamage_is_player == 1 &&
                            !(log.death.killed_by == log.death.mostdamage_by)
                        ) {
                            playerMostDamageByID =
                                await serverLogs.getKillerPlayer(
                                    log.death.mostdamage_by
                                );
                        }

                        const embed = new EmbedBuilder()
                            .setColor(
                                log.pvp_type === "Ally" ? "#00FF00" : "#FF0000"
                            )
                            .setTitle(
                                log.pvp_type === "Ally"
                                    ? `ALLY DIED`
                                    : "ENEMY DIED"
                            )
                            .setDescription(
                                log.death.killed_by == log.death.mostdamage_by
                                    ? `${log.pvp_type === "Ally" ? `${log.memberID != null ? `<@!${log.memberID}> ${randomMessage}\n\n` : `${log.name} ${randomMessage}\n\n`}` : "" }` + `${utils.convertTimestamp(
                                          log.death.time
                                      )}  [${
                                          log.name
                                      }](https://saiyansreturn.com/profile/${
                                          log.id
                                      }?server=Universe%20Beerus): Killed by ${
                                          log.death.is_player == 1
                                              ? `[${log.death.killed_by}](https://saiyansreturn.com/profile/${playerKilledByID}?server=Universe%20Beerus)`
                                              : log.death.killed_by
                                      }`
                                    : `${log.pvp_type === "Ally" ? `${log.memberID != null ? `<@!${log.memberID}> ${randomMessage}\n\n` : `${log.name} ${randomMessage}\n\n`}` : "" }` + `${utils.convertTimestamp(
                                          log.death.time
                                      )}  [${
                                          log.name
                                      }](https://saiyansreturn.com/profile/${
                                          log.id
                                      }?server=Universe%20Beerus): Killed by ${
                                          log.death.is_player == 1
                                              ? `[${log.death.killed_by}](https://saiyansreturn.com/profile/${playerKilledByID}?server=Universe%20Beerus)`
                                              : log.death.killed_by
                                      } and ${
                                          log.death.mostdamage_is_player == 1
                                              ? `[${log.death.mostdamage_by}](https://saiyansreturn.com/profile/${playerMostDamageByID}?server=Universe%20Beerus)`
                                              : log.death.mostdamage_by
                                      }`
                            );

                        await channelDeaths.send({
                            embeds: [embed],
                        });
                    }
                } else {
                    console.error(
                        "Canal não encontrado. Verifique se CHANNEL_SERVER_LOGS_ID está correto no arquivo .env."
                    );
                }
            }

            console.log("Inicia a busca na apiRots!");
            const allPlayers = await rotsApi.findAllPlayersParallel();
            console.log("Encerra a busca na apiRots!");
            console.log("Inicia a atualização da base!");
            await db.updatePlayers(allPlayers);
            console.log("Encerra a atualização da base!");
        } catch (error) {
            console.error("Erro durante a execução do cron:", error);
        } finally {
            const endTime = performance.now();
            const executionTime = (endTime - startTime) / 1000;
            console.log(
                `Ciclo do cron concluído em ${executionTime.toFixed(
                    2
                )} segundos.`
            );
            isRunning = false;
        }
    });
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
                content: "Houve um erro ao processar o comando!",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: "Houve um erro ao processar o comando!",
                ephemeral: true,
            });
        }
    }
});
