import { PrismaClient } from "@prisma/client";
import { Message, PermissionFlagsBits } from "discord.js";

const prisma = new PrismaClient();

const setPrefix = async (message: Message, args: string) => {
    if (!args || args.length === 0) {
        message.reply("Por favor, forneça um novo prefixo!");
        return;
    }

    const newPrefix = args[0];

    if (newPrefix.length > 3) {
        message.reply({ content: "Você precisa informar um prefixo com menos de 3 caracteres!" })
        return
    }

    if (!message.guild?.id) {
        console.error("ID da guilda não está definido corretamente.");
        return;
    }

    try {
        let guild = await prisma.guild.findUnique({
            where: { guildId: message.guild.id },
        });

        if (!guild) {
            guild = await prisma.guild.create({
                data: {
                    guildId: message.guild.id,
                    guildName: message.guild.name,
                    prefix: newPrefix,
                },
            });
        } else {
            guild = await prisma.guild.update({
                where: { guildId: message.guild.id },
                data: { prefix: newPrefix },
            });
        }

        message.reply(`O novo prefixo foi definido para: '${newPrefix}'`);
    } catch (error) {
        console.error("Erro ao definir o prefixo:", error);
        message.reply("Ocorreu um erro ao definir o prefixo. Por favor, tente novamente mais tarde.");
    }
};

export default {
    name: 'setprefix',
    aliases: ["setprefixo"],
    isOwnerGuild: false,
    permission: [PermissionFlagsBits.Administrator],
    action: setPrefix
};
