from main import Bot, commands
import discord

class Bots(commands.Cog):
    def __init__(self, bot: Bot) -> None:
        self.bot = bot
        super().__init__()
    
    @commands.guild_only()
    @commands.hybrid_group(name="bot", aliases=["bots"])
    async def bots(self, ctx):
        """Manage the bots in the guild"""
        ...
    
    @commands.guild_only()
    @bots.command(name="add")
    @discord.app_commands.describe(user="The bot", prefix="The bot prefix", description="The bot description")
    @commands.cooldown(1, 30, commands.BucketType.member)
    async def add(self, ctx: commands.Context, user: discord.User, prefix: str, *, description: str):
        """Add a bot to this guild"""
        if ctx.guild.get_member(user.id):
            raise commands.BadArgument("That bot/user is already in this server.")
        if len(prefix) >= 15 or len(prefix) < 2:
            raise commands.BadArgument("Invalid prefix provided.")
        emb = discord.Embed(colour=discord.Colour.yellow(), title="Pending bot!", description=description)
        emb.set_author(name=ctx.author.name, icon_url=ctx.author.display_avatar)
        emb.set_footer(text=user.name, icon_url=user.display_avatar)
        emb.add_field(name="Prefix", value=prefix)
        emb.set_thumbnail(url=user.display_avatar)
        v = discord.ui.View().add_item(discord.ui.Button(style=discord.ButtonStyle.link, label="Invite", url=f"https://discord.com/api/oauth2/authorize?client_id={user.id}&permissions=0&scope=bot"))
        channel = self.bot.get_channel(1111852742525321368)
        await channel.send(content="<@&842242146130984961>",embed=emb, view=v)
        await ctx.send("Your bot was added to queue!", ephemeral=True)
    
    @commands.guild_only()
    @bots.command(name="accept")
    @commands.has_role(842242146130984961)
    async def accept(self, ctx: commands.Context, user: discord.Member):
        """Accept a bot to add to this guild"""
        emb = discord.Embed(colour=discord.Colour.brand_green(), title="Accepted bot!")
        emb.add_field(name="Tester", value=ctx.author.mention)
        emb.add_field(name="Bot", value=user.mention)
        emb.set_footer(text=user.name, icon_url=user.display_avatar)
        emb.set_author(name=ctx.author.name, icon_url=ctx.author.display_avatar)
        await user.add_roles(discord.Object(848436249999048704))
        emb.set_thumbnail(url=ctx.author.display_avatar)
        channel = self.bot.get_channel(1111852742525321368)

        await channel.send(embed=emb)
        await ctx.send("The bot was accepted!", ephemeral=True)
    
    @commands.guild_only()
    @bots.command(name="deny", aliases=["decline"])
    @commands.has_role(842242146130984961)
    async def deny(self, ctx: commands.Context, member: discord.Member, *, reason: str):
        """Decline and kick a bot from this guild"""
        await member.kick()
        emb = discord.Embed(colour=discord.Colour.brand_red(), title="Declined bot!")
        emb.add_field(name="Tester", value=ctx.author.mention)
        emb.add_field(name="Bot", value=member.mention)
        emb.add_field(name="Reason", value=reason, inline=False)
        emb.set_footer(text=member.name, icon_url=member.display_avatar)
        emb.set_author(name=ctx.author.name, icon_url=ctx.author.display_avatar)
        emb.set_thumbnail(url=ctx.author.display_avatar)
        channel = self.bot.get_channel(1111852742525321368)
        await channel.send(embed=emb)
        await ctx.send("The bot was declined!", ephemeral=True)


async def setup(bot: Bot):
    await bot.add_cog(Bots(bot))
