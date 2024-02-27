import { PrismaClient } from "@prisma/client";
import { Message, PermissionFlagsBits } from "discord.js";

const prisma = new PrismaClient();

const pingCommand = async (message: Message) => {
    const originalMessage = await message.channel.send("Pong 🏓");

    const latency = originalMessage.createdTimestamp - message.createdTimestamp;

    originalMessage.edit({ content: `Ping: ${latency}ms` });

    await prisma.user.create({
        data: {
            userid: message.author.id,
            username: message.author.username,
        },

    });
};

export default {
    name: 'ping',
    aliases: ['ws', 'latencia', 'latência', 'latency'],
    isOwnerGuild: false,
    permission: [PermissionFlagsBits.SendMessages],
    action: pingCommand
};
