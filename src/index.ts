import Ayu from "./core/client";
import "dotenv/config"

const token: string = process.env.DISCORD_TOKEN 

const client: Ayu = new Ayu("MTIxMTg3NjM1NjA0OTMzODQyOA.GVxNz7.vyVyh8nI2QdQNEC52a1yNNPGCz4zdVPh5WT6Vs")

client.run()