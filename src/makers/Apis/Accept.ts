import { Maker, Command, Group, Param, ParamType, Context, Plugins, Errors, Builders, AnyTextableChannel } from "erine";
import { db } from "src/main";

export class data extends Maker {

    @Group({ name: "api", description: "Manage the APIs" })
    @Command({ description: "Accept an API" })
    @Plugins.check(async function(ctx: Context) {
        if(!ctx.member?.roles.includes("842242146130984961")) throw new Errors.MissingPermission(ctx, ["MANAGE_GUILD"], "You don't have permissions enough to use this command!")
        else return true
    })
    @Param(ParamType.String, { name: "apiURL", description: "The API url to accept.", required: true })
    async accept(ctx: Context) {
        const embed = new Builders.EmbedBuilder()
        .setAuthor(ctx.author.username, ctx.author.avatarURL())
        .setColor(0x2ecc71)
        .addField("URL", ctx.get<string>("apiURL")!, true)
        .addField("Mod", ctx.author.tag, true)
        .setTitle("API accepted!")
        .setTimestamp(new Date().toString());
        await db.push("list", ctx.get<string>("apiURL"), "apis")
        let channel = await this.bot.core.getChannel("1111852742525321368", { guild: ctx.guild!, force: true }) as AnyTextableChannel
        await channel.createMessage({ embeds: [embed.toJSON()] })
        await ctx.send({ content: "The API was accepted successfully!", flags: 64 })
    }

}