import { Message, PermissionFlagsBits } from "discord.js";
import emoji from "../../../settings/bot";

export default {
    name: "ping",
    aliases: ["ws", "latencia", "latência", "latency"],
    isOwnerGuild: false,
    permission: [PermissionFlagsBits.SendMessages],
    action: async (message: Message) => {
        const originalMessage = await message.channel.send("Pong 🏓");
    
        const latency = message.client.ws.ping;
    
        const network = emoji.network;
        originalMessage.edit({ content: `${network} | Ping: **${latency}**ms` });
    }
};
