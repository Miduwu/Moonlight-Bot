import { Maker, Command, Group, Param, ParamType, Context, Plugins, Errors, Builders, AnyTextableChannel } from "erine";

export class data extends Maker {

    @Group({ name: "bot", description: "Manage the bots", aliases: ["bots"] })
    @Command({ description: "Deny a bot", aliases: ["decline"] })
    @Param(ParamType.Number, { name: "id", description: "The bot ID.", required: true })
    @Param(ParamType.String, { name: "reason", description: "The reason why this bot was declined.", required: true, ellipsis: true })
    @Plugins.check(async function(ctx: Context) {
        if(!ctx.member?.roles.includes("842242146130984961")) throw new Errors.MissingPermission(ctx, ["MANAGE_GUILD"], "You don't have permissions enough to use this command!")
        else return true
    })
    async deny(ctx: Context) {
        let member = await ctx.guild?.getMember(ctx.get<string>("id")!)
        if(!member) throw new Errors.InvalidParam(ctx, {}, "Invalid bot id provided.")

        const embed = new Builders.EmbedBuilder()
        .setAuthor(ctx.author.username, ctx.author.avatarURL())
        .setColor(0xe74c3c)
        .setThumbnail(member.user.avatarURL())
        .addField("Name", member.user.username, true)
        .addField("Tester", ctx.author.tag, true)
        .addField("Reason", ctx.get<string>("reason")!)
        .setTitle("Bot denied!")
        .setTimestamp(new Date().toString());

        member.kick("Declined bot")
        let channel = await this.bot.core.getChannel("1111852742525321368", { guild: ctx.guild!, force: true }) as AnyTextableChannel
        await channel.createMessage({ embeds: [embed.toJSON()] })
        await ctx.send({ content: "The bot was declined successfully!", flags: 64 /** ephemeral */ })
    }

}