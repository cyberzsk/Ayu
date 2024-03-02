import Ayu from "./core/client";
import "dotenv/config";

const token: string = process.env.DISCORD_TOKEN; 

const client: Ayu = new Ayu(token);

client.run();