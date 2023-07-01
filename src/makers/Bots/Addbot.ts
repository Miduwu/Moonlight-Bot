import { Maker, Command, Group, Context, Param, ParamType, Plugins, Bucket, Errors, Builders, User, AnyTextableChannel } from "erine";

export class data extends Maker {
    @Group({ name: "bot", description: "Manage the bots", aliases: ["bots"] })
    @Command({ description: "Add a bot to queue." })
    @Param(ParamType.Number, { name: "id", description: "The bot ID.", required: true })
    @Param(ParamType.String, { name: "prefix", description: "Bot prefix, / means slash.", required: true })
    @Param(ParamType.String, { name: "description", description: "A detailed description about this bot, please include programming language", required: true, ellipsis: true })
    @Plugins.cooldown(120, Bucket.User)
    async add(ctx: Context) {
        let user = await this.bot.rest.request({ path: `/users/${ctx.get("id")}`, method: "POST" }).catch(this.bot.core.noop) as User
        if(!user) throw new Errors.InvalidParam(ctx, {}, "Invalid bot id provided.")
        if(ctx.get<string>("prefix")!.length < 2 || ctx.get<string>("prefix")!.length > 15) throw new Errors.InvalidParam(ctx, {}, "Your prefix is too short or too long.")

        const embed = new Builders.EmbedBuilder()
        .setAuthor(ctx.author.username, ctx.author.avatarURL())
        .setColor(0x040E20)
        .setThumbnail(user.avatarURL())
        .setTitle("New bot!")
        .setDescription(ctx.get<string>("description")!)
        .addField("Name", user.username, true)
        .addField("Prefix", ctx.get<string>("prefix")!, true)
        .setTimestamp(new Date().toString());

        const r = new Builders.ComponentBuilder().addURLButton({ url: `https://discord.com/api/oauth2/authorize?client_id=${ctx.get("id")}&permissions=0&scope=bot`, label: "Invite" })

        let channel = await this.bot.core.getChannel("1111852742525321368", { guild: ctx.guild!, force: true }) as AnyTextableChannel
        await channel.createMessage({ embeds: [embed.toJSON()] })
        await ctx.send({ content: "Your bot was uploaded successfully!", flags: 64 })
    }
}