import Ayu from "./core/client";
import "dotenv/config"

const token: string = process.env.DISCORD_TOKEN 

const client: Ayu = new Ayu(token, "C:\\Users\\Sanji\\Documents\\Discord Bots\\Ayu\\src\\commands\\prefix")

client.run()