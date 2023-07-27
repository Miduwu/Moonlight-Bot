from main import Bot, commands, db
import discord, aiohttp
from discord.ext import tasks

class APIS(commands.Cog):
    def __init__(self, bot: Bot):
        self.bot = bot
        self.task.start()

    @commands.hybrid_group(name="apis", aliases=["api"])
    async def apis(self, ctx):
        """Manage the APIs in this guild"""
        ...
    
    @apis.command(name="add")
    @commands.guild_only()
    @discord.app_commands.describe(apiurl="The URL to make the request every 4 minutes")
    @commands.cooldown(1, 30, commands.BucketType.member)
    async def add(self, ctx: commands.Context, apiurl: str):
        """Add an API to this guild, so we will be fetching it every 4 minutes"""
        emb = discord.Embed(colour=discord.Colour.yellow(), title="Pending API!")
        emb.set_author(name=ctx.author.name, icon_url=ctx.author.display_avatar)
        emb.add_field(name="API", value=apiurl)
        emb.add_field(name="Interval", value="4 minutes", inline=False)
        emb.set_thumbnail(url=ctx.author.display_avatar)
        channel = self.bot.get_channel(1111852742525321368)
        await channel.send(content="<@&842242146130984961>", embed=emb)
        await ctx.send("Your API was added to queue!", ephemeral=True)
    
    @commands.guild_only()
    @apis.command(name="accept")
    @commands.has_role(842242146130984961)
    async def accept(self, ctx: commands.Context, apiurl: str):
        """Accept an API to add to this guild"""
        emb = discord.Embed(colour=discord.Colour.brand_green(), title="Accepted API!")
        emb.add_field(name="Tester", value=ctx.author.mention)
        emb.add_field(name="API", value=apiurl)
        emb.set_author(name=ctx.author.name, icon_url=ctx.author.display_avatar)
        emb.set_thumbnail(url=ctx.author.display_avatar)
        before = db.get("list", "apis") or []
        before.append(apiurl)
        db.set("list", before, "apis")
        channel = self.bot.get_channel(1111852742525321368)
        await channel.send(embed=emb)
        await ctx.send("The API was accepted!", ephemeral=True)
    
    @commands.guild_only()
    @apis.command(name="deny", aliases=["decline"])
    @commands.has_role(842242146130984961)
    async def deny(self, ctx: commands.Context, apiurl: str, *, reason: str):
        """Decline an API from this guild"""
        emb = discord.Embed(colour=discord.Colour.brand_red(), title="Declined API!")
        emb.add_field(name="Author", value=ctx.author.mention)
        emb.add_field(name="API", value=apiurl)
        emb.add_field(name="Reason", value=reason, inline=False)
        emb.set_author(name=ctx.author.name, icon_url=ctx.author.display_avatar)
        emb.set_thumbnail(url=ctx.author.display_avatar)
        channel = self.bot.get_channel(1111852742525321368)
        await channel.send(embed=emb)
        await ctx.send("The API was declined!", ephemeral=True)
    
    @commands.guild_only()
    @apis.command(name="remove", aliases=["delete"])
    @commands.has_role(842242146130984961)
    async def remove(self, ctx: commands.Context, apiurl: str, *, reason: str):
        """Removes an API (forced)"""
        apis = db.get("list", "apis") or []
        if not apiurl in apis:
            raise commands.BadArgument("That API is not in the database")
        apis.remove(apiurl)
        db.set("list", apis,"apis")
        emb = discord.Embed(colour=discord.Colour.brand_red(), title="Declined API!")
        emb.add_field(name="Author", value=ctx.author.mention)
        emb.add_field(name="API", value=apiurl)
        emb.add_field(name="Reason", value=reason, inline=False)
        emb.set_author(name=ctx.author.name, icon_url=ctx.author.display_avatar)
        emb.set_thumbnail(url=ctx.author.display_avatar)
        channel = self.bot.get_channel(1111852742525321368)
        await channel.send(embed=emb)
        await ctx.send("The API was declined!", ephemeral=True)
    
    @tasks.loop(minutes=1)
    async def task(self):
        arr = db.get("list", "apis") or []
        if not len(arr):
            return
        print("APIs fetched!")
        async with aiohttp.ClientSession() as session:
            for api in arr:
                try:
                    async with session.get(api) as res:
                        pass
                except:
                    pass
        
async def setup(bot: Bot):
    await bot.add_cog(APIS(bot))