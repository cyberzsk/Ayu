import { PrismaClient } from "@prisma/client";
import { PermissionFlagsBits, type Message } from "discord.js";
import emoji from "../../../settings/bot";

const prisma = new PrismaClient();

const disableIA = async (message: Message) => {
    if (!message.guild?.id) {
        return;
    }

    const loading = emoji.loading;
    const msg = await message.reply({ content: `${loading} Aguarde uns segundos...` });

    try {
        const guild = await prisma.guild.findUnique({
            where: { guildId: message.guild.id },
        });

        if (!guild || !guild.ia) {
            msg.edit("A IA já está desativada neste servidor.");
            return;
        }

        await prisma.guild.update({
            where: { guildId: message.guild.id },
            data: { ia: false },
        });

        msg.edit("IA desativada com sucesso!");
    } catch (error) {
        console.error("Erro ao desativar a IA:", error);
        message.reply("Ocorreu um erro ao desativar a IA. Por favor, tente novamente mais tarde.");
    }
};

export default {
    name: "disable.ia",
    aliases: ["dsb.ia"],
    isOwnerGuild: false,
    permission: [PermissionFlagsBits.Administrator],
    action: disableIA
};