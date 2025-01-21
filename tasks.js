const cron = require('node-cron');

module.exports = (client) => {
    cron.schedule('*/15 * * * * *', async () => {
        const allPlayers = await rotsApi.findAllPlayers()    
        await db.updatePlayers(allPlayers)
    })
}