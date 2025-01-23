const { MongoClient } = require('mongodb')
const dotenv = require('dotenv')
dotenv.config()
const { MONGO_HOST, MONGO_DATABASE } = process.env

let singleton

const connect = async () => {
    if (singleton) return singleton

    const client = new MongoClient(MONGO_HOST)
    await client.connect()

    singleton = client.db(MONGO_DATABASE)
    return singleton    
}

const insert = async (player) => {
    const db = await connect()
    return db.collection('players').insertOne(player)
}

const update = async (filter, updatedFields) => {
    const db = await connect();
    return db.collection('players').updateOne(filter, { $set: updatedFields });
};

const updatePlayers = async (playersArray) => {
    const db = await connect();
    const collection = db.collection('players');
    // let count = 0

    for (const player of playersArray) {

        // Atualiza cada jogador com base no filtro (por exemplo, `_id` ou `name`)
        await collection.updateOne(
            { id: player.id }, // Filtro (ajuste conforme o identificador que está usando)
            { $set: player } // Atualiza os campos com os dados do objeto atual
        );
        // console.log(`Update: ${count}/${playersArray.length}`)
        // count++
    }
    // console.log('Base updated.')
};

const listEnemies = async (enemyGuild = null) => {
    const db = await connect()
    if (enemyGuild != null) {
        const enemies = await db.collection('players')
                                    .find(
                                        { guild_name: enemyGuild, pvp_type: 'Enemy' },
                                        { projection: { 'deaths.deaths': 1, name: 1, id: 1 } }
                                    )
                                    .toArray();
        return enemies
    } else {
        const enemies = await db.collection('players')
                                    .find(
                                        { pvp_type: 'Enemy' },
                                        { projection: { 'deaths.deaths': 1, name: 1, id: 1 } }
                                    )
                                    .toArray();
        return enemies
    }
}

const listAllies = async (allyGuild = null) => {
    const db = await connect()
    if (allyGuild != null) {
        const allies = await db.collection('players')
                                    .find(
                                        { pvp_type: 'Ally' },
                                        { projection: { 'deaths.deaths': 1, name: 1, id: 1 } }
                                    )
                                    .toArray();
        return allies
    } else {
        const allies = await db.collection('players')
                                    .find(
                                        { pvp_type: 'Ally' },
                                        { projection: { 'deaths.deaths': 1, name: 1, id: 1 } }
                                    )
                                    .toArray();
        return allies
    }
}

const findPlayerByNameIgnoreCase = async (name) => {
    const db = await connect()
    return db.collection('players').findOne({ name: new RegExp(`^${name}$`, 'i') })
}

const findPlayerByID = async (id) => {
    const db = await connect()
    return db.collection('players').findOne({ id: id})
}

const findTypePlayerByID = async (id) => {
    const db = await connect()
    const player = await db.collection('players').findOne({ id })
    return player.pvp_type
}

const findAll = async () => {
    const db = await connect()
    return db.collection('players').find().toArray()
}

module.exports = {
    insert,
    findPlayerByNameIgnoreCase,
    findTypePlayerByID,
    findAll,
    findPlayerByID,
    listEnemies,
    listAllies,
    update,
    updatePlayers
}