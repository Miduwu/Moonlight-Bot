import { Erine } from "erine";
import { Database } from "midb";
import { config } from "dotenv";

config()

const bot = new Erine({
    auth: `Bot ${process.env.TOKEN}`,
    prefix: "mun!",
    autoSync: true,
    guildOnly: true,
    gateway: {
        intents: ["ALL"],
        presence: {
            status: "idle",
            activities: [ { name: "Moonlight Public", type: 3 } ]
        }
    }
})

const db = new Database({ path: "./db", tables: ["apis"] })
db.start()

bot.load(`./${__dirname}/makers`).then(() => console.log("Makers successfully loaded!"))

bot.connect()

export { bot, db }