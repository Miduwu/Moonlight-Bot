import discord, os, dotenv, asyncio
from discord.ext import commands
from libs.midb import Database

dotenv.load_dotenv()

os.environ["JISHAKU_NO_UNDERSCORE"] = "True"
os.environ["JISHAKU_NO_DM_TRACEBACK"] = "True" 

description = """
Hi! I'm the Moonlight Bot and im here to help you!
"""

db = Database("./db", ["apis"])

class Bot(commands.Bot):
    async def setup_hook(self) -> None:
        await self.load_extension("jishaku") # feature
        for file in os.listdir('./cogs'):
            if file.endswith('.py'):
                await self.load_extension(f'cogs.{file[:-3]}')

bot = Bot(
    command_prefix="m!",
    description=description,
    owner_ids=[664261902712438784],
    intents=discord.Intents.all(),
    activity=discord.Activity(type=discord.ActivityType.listening, name="Moonlight Public")
)

@bot.hybrid_command()
async def ping(ctx: commands.Context):
    """Replies with pong"""
    await ctx.send("aña")

async def main():
    async with bot:
        await bot.start(os.getenv('TOKEN'))

if __name__ == "__main__":
    asyncio.run(main())