from main import Bot, commands

class Listeners(commands.Cog):
    def __init__(self, bot: Bot) -> None:
        self.bot = bot
        super().__init__()

    @commands.Cog.listener()
    async def on_ready(self):
        print(f"Logged in as {self.bot.user.name}")
        await self.bot.tree.sync()
    
    @commands.Cog.listener()
    async def on_command_error(self, ctx: commands.Context, error):
        try:
            await ctx.send(str(error))
        except:
            pass

async def setup(bot: Bot):
    await bot.add_cog(Listeners(bot))