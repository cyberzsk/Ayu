import Ayu from "./core/client";
import "dotenv/config"

const token: string = process.env.DISCORD_TOKEN 
const filePath: string = "commands/prefix"

const client: Ayu = new Ayu(token, filePath)

client.run()