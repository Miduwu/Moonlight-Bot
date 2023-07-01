import { Maker, Command, Group, Param, ParamType, Context, Plugins, Errors, Builders, AnyTextableChannel } from "erine";

export class data extends Maker {

    @Group({ name: "api", description: "Manage the APIs" })
    @Command({ description: "Decline an API", aliases: ["decline", "remove"] })
    @Plugins.check(async function(ctx: Context) {
        if(!ctx.member?.roles.includes("842242146130984961")) throw new Errors.MissingPermission(ctx, ["MANAGE_GUILD"], "You don't have permissions enough to use this command!")
        else return true
    })
    @Param(ParamType.String, { name: "apiURL", description: "The API url to accept.", required: true })
    @Param(ParamType.String, { name: "reason", description: "Why did u deny this API?", required: true, ellipsis: true })
    async deny(ctx: Context) {
        const embed = new Builders.EmbedBuilder()
        .setAuthor(ctx.author.username, ctx.author.avatarURL())
        .setColor(0xe74c3c)
        .addField("URL", ctx.get<string>("apiURL")!, true)
        .addField("Mod", ctx.author.tag, true)
        .addField("Reason", ctx.get<string>("reason")!, true)
        .setTitle("API denied!")
        .setTimestamp(new Date().toString());
        let channel = await this.bot.core.getChannel("1111852742525321368", { guild: ctx.guild!, force: true }) as AnyTextableChannel
        await channel.createMessage({ embeds: [embed.toJSON()] })
        await ctx.send({ content: "The API was declined successfully!", flags: 64 })
    }

}