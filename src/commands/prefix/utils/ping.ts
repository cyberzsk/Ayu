import { Message, PermissionFlagsBits } from "discord.js";
import emoji from "../../../settings/bot";

async function pingCommand(message: Message) {
    const originalMessage = await message.channel.send("Pong 🏓");

    const latency = originalMessage.createdTimestamp - message.createdTimestamp;

    const network = emoji.network;
    originalMessage.edit({ content: `${network} | Ping: **${latency}**ms` });
}

export default {
    name: "ping",
    aliases: ["ws", "latencia", "latência", "latency"],
    isOwnerGuild: false,
    permission: [PermissionFlagsBits.SendMessages],
    action: pingCommand
};
