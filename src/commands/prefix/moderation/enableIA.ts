import { PrismaClient } from "@prisma/client";
import { Message, PermissionFlagsBits } from "discord.js";
import emoji from "../../../settings/bot";

const prisma = new PrismaClient();

const activeIA = async (message: Message) => {
    if (!message.guild?.id) {
        return;
    }

    const loading = emoji.loading;
    const msg = await message.reply({ content: `${loading} Aguarde uns segundos...` });

    try {
        let guild = await prisma.guild.findUnique({
            where: { guildId: message.guild.id },
        });

        if (!guild) {
            guild = await prisma.guild.create({
                data: {
                    guildId: message.guild.id,
                    guildName: message.guild.name,
                    ia: true
                },
            });
        } else {
            guild = await prisma.guild.update({
                where: { guildId: message.guild.id },
                data: { ia: true },
            });
        }

        msg.edit("IA ativada com sucesso!");
    } catch (error) {
        console.error("Erro ao ativar a IA:", error);
        message.reply("Ocorreu um erro ao ativar a IA. Por favor, tente novamente mais tarde.");
    }
};

export default {
    name: "enable.ia",
    aliases: [],
    isOwnerGuild: false,
    permission: [PermissionFlagsBits.Administrator],
    action: activeIA
};