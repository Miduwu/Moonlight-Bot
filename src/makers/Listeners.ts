import { Maker, Event, AnyError, Errors, Builders, Command, Context } from "erine";
import axios from "axios";
import { db } from "../main";

async function loop(api_url: string) {
    return await axios.get(api_url, { timeout: 10_000 }).catch(e=>e.response)
}

export class data extends Maker {
    public cross: string = "<:Cross:829109836943720499>"

    @Command({ description: "Responds with pong" })
    async ping(ctx: Context) {
        await ctx.send("Pong! " + ctx.guild?.shard.latency)
    }

    @Event
    async ready() {
        console.log(`${this.bot.user.toJSON().username} logged in.`)
        setInterval(async function() {
            let apis: string[] = await db.get("list", "apis")
            for(const api in apis) {
                let res = await loop(api)
                await db.set(`status.list.${api}`, res.status, "apis")
            }
            await db.set("status.time", Date.now(), "apis")
        }, 240000)
    }

    @Event
    async error(error: AnyError) {
        // @ts-ignore
        if(Object.keys(Errors).some(e => error instanceof Errors[e])) {
            const embed = new Builders.EmbedBuilder()
            .setDescription(`${this.cross} ${error.message}`)
            .setColor(0xe74c3c)
            await error.ctx.send({ embeds: [embed.toJSON()] })
        } else return
    }

}