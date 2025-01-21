const db = require('./data/db')
const rotsApi = require('./data/rotsApi')
// comparações
// LV UP
// LAST DEATH


const compareLevel = async () => {
    const players = await db.findAll()
    let response = []

    for (const player of players) {
        let playerApiRots = await rotsApi.findPlayerByID(player.id)
        let lastLevelSaved = player.level        
        let lastLevelApiRots = playerApiRots.level
        let updatedPlayer = player              

        if (lastLevelApiRots > lastLevelSaved){
            updatedPlayer.level = playerApiRots.level
            updatedPlayer.former_level = lastLevelSaved
            updatedPlayer.log_type = 'upLevel'
            response.push(updatedPlayer)
            //console.log(`mudou o level de ${player.name}`)
        }                  
    }    
    
    return response
}

const compareDeath = async () => {
    const players = await db.findAll()
    let response = []

    for (const player of players) {
        let playerApiRots = await rotsApi.findPlayerByID(player.id)
        let lastDeathSaved = player.deaths.deaths[0]
        let lastDeathApiRots = playerApiRots.deaths.deaths[0]
        let updatedPlayer = player 

        if (lastDeathSaved.time != lastDeathApiRots.time){
            updatedPlayer.deaths = playerApiRots.deaths
            updatedPlayer.log_type = 'newDeath'
            response.push(updatedPlayer)
            //console.log(`mudou a morte de ${player.name}`)
        }  
    }

    return response  
}

module.exports = {
    compareLevel,
    compareDeath   
}