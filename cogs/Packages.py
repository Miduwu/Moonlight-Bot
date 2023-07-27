from main import Bot, commands
import discord, aiohttp

class Packages(commands.Cog):
    @commands.guild_only()
    @commands.hybrid_command(name="eats", aliases=["function", "func", "f"])
    @discord.app_commands.describe(func="The ea.ts function")
    async def eats(self, ctx: commands.Context, func: str):
        """Check how to use a ea.ts function"""
        async with aiohttp.ClientSession() as session:
            async with session.get("https://munlapi.miduwu.repl.co/eats/all") as res:
                arr = await res.json()
                filt = [ thing for thing in arr if thing["name"].replace("$", "").lower().startswith(func.replace("$", "").lower()) ]
                if not len(filt):
                    raise commands.BadArgument("I was unable to find something related to that.")
                emb = discord.Embed(colour=0x3498DB, title=filt[0]["name"], description=filt[0]["extra"]["description"])
                emb.add_field(name="Use", value=filt[0]["extra"]["use"], inline=False)
                emb.add_field(name="Returns", value=filt[0]["extra"]["returns"], inline=False)
                emb.set_author(name="easy-api.ts (stable)")
                emb.set_footer(text=f"@{ctx.author.name}")
                emb.set_thumbnail(url="https://cdn.discordapp.com/attachments/1009997572473094165/1127453873624326214/8471c86450499e4150e19217dc4de155-1-removebg-preview.png")
                await ctx.send(embed=emb)
    
    @eats.autocomplete(name="func")
    async def eatsauto(self, interaction: discord.Interaction, current: str):
        async with aiohttp.ClientSession() as session:
            async with session.get("https://munlapi.miduwu.repl.co/eats/all") as res:
                arr = await res.json()
                # arr = arr["data"]
                return [ discord.app_commands.Choice(name=item["name"], value=item["name"]) for item in arr if item["name"].replace("$", "").startswith(current.replace("$", "")) ][:25]
            
async def setup(bot: Bot):
    await bot.add_cog(Packages(bot))