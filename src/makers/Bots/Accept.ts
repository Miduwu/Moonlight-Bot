import { Maker, Command, Group, Param, ParamType, Context, Plugins, Errors, Builders, AnyTextableChannel } from "erine";

export class data extends Maker {

    @Group({ name: "bot", description: "Manage the bots", aliases: ["bots"] })
    @Command({ description: "Accepts a bot" })
    @Param(ParamType.Number, { name: "id", description: "The bot ID.", required: true })
    @Plugins.check(async function(ctx: Context) {
        if(!ctx.member?.roles.includes("842242146130984961")) throw new Errors.MissingPermission(ctx, ["MANAGE_GUILD"], "You don't have permissions enough to use this command!")
        else return true
    })
    async accept(ctx: Context) {
        let member = await ctx.guild?.getMember(ctx.get<string>("id")!)
        if(!member) throw new Errors.InvalidParam(ctx, {}, "Invalid bot id provided.")

        const embed = new Builders.EmbedBuilder()
        .setAuthor(ctx.author.username, ctx.author.avatarURL())
        .setColor(0x2ecc71)
        .setThumbnail(member.user.avatarURL())
        .addField("Name", member.user.username, true)
        .addField("Tester", ctx.author.tag, true)
        .setTitle("Bot accepted!")
        .setTimestamp(new Date().toString());

        member.addRole("848436249999048704")
        let channel = await this.bot.core.getChannel("1111852742525321368", { guild: ctx.guild!, force: true }) as AnyTextableChannel
        await channel.createMessage({ embeds: [embed.toJSON()] })
        await ctx.send({ content: "The bot was accepted successfully!", flags: 64 })
    }

}