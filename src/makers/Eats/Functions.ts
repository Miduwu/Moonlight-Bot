import { Context, Command, Errors, Maker, Param, ParamType, Dispatch, AutocompleteInteraction } from "erine";
import { API, SourceFunction } from "easy-api.ts";
import { cwd } from "process";
import { join } from "path"

const api = new API({ port: 3000 });
const dir = join(cwd(), "/node_modules/easy-api.ts/package.json");

class EatsFns extends Maker {
    @Command({ aliases: ["func", "fn", "f"], name: "function", description: "Return a easy-api.ts function data." })
    @Param(ParamType.String, { autocomplete: true, name: "name", description: "Function name.", required: true })
    async eatsfunc(ctx: Context) {
        const name = ctx.get<string>("name")!;
        const found = api.interpreter.functions.filter((func: SourceFunction) => func.data.name.toLowerCase().startsWith(name.toLowerCase()))[0];
        if(!found) throw new Errors.InvalidParam(ctx, {}, "Invalid function name provided!");
        await ctx.send({
            embeds: [{
                author: {
                    name: "easy-api.ts (Stable)",
                    iconURL: ctx.guild?.iconURL()!
                },
                title: found.data.name,
                description: found.data.description,
                fields: [{
                    name: "Usage",
                    value: `\`\`\`yaml\n${found.data.extra.use}\n\`\`\``
                },{
                    name: "Returns",
                    value: found.data.extra.returns
                }],
                footer: (await import(dir)).version,
                color: 0x3498DB
            }]
        })
    }

    @Dispatch
    async name(interaction: AutocompleteInteraction) {
        let filtered = api.interpreter.functions.filter(f => f.data.name.toLowerCase().startsWith(interaction.data.options.getFocused()))
        interaction.result(filtered.map(f => { return { name: f.data.name, value: f.data.name } }).slice(0, 24))
    }
}

export const data = EatsFns;