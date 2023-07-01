import { Maker, Command, Group, Context, Param, ParamType, Plugins, Bucket, Builders, AnyTextableChannel } from "erine";

export class data extends Maker {

    @Group({ name: "api", description: "Manage the APIs" })
    @Command({ description: "Add an API to the pinger." })
    @Plugins.cooldown(60, Bucket.Member)
    @Param(ParamType.String, { name: "apiURL", description: "The API url.", required: true })
    @Param(ParamType.String, { name: "apiName", description: "The API name.", required: true })
    async add(ctx: Context) {
        const embed = new Builders.EmbedBuilder()
        .setAuthor(ctx.author.username, ctx.author.avatarURL())
        .setColor(0x040E20)
        .setTitle("New API!")
        .setDescription(ctx.get<string>("description")!)
        .addField("Name", ctx.get<string>("apiName")!, true)
        .addField("URL", ctx.get<string>("apiURL")!, true)
        .setTimestamp(new Date().toString());

        let channel = await this.bot.core.getChannel("1111852742525321368", { guild: ctx.guild!, force: true }) as AnyTextableChannel
        await channel.createMessage({ embeds: [embed.toJSON()] })
        await ctx.send({ content: "Your API was uploaded successfully!", flags: 64 })
    }

}