import { PrismaClient } from "@prisma/client";
import { PermissionFlagsBits, type Message } from "discord.js"
import emoji from "../../../settings/bot";

const prisma = new PrismaClient();

const removeBlackList = async (message: Message) => {
    const anya = emoji.anya;
    const confirm_gif = emoji.confirm_gif
    const target = message.mentions.members?.first();

    if (!target) {
        return message.reply("❌ **|** Você precisa mencionar o usuário que deseja remover da blacklist.");
    }

    try {
        const userInDB = await prisma.user.findUnique({
            where: { userid: target.id }
        });

        if (!userInDB || !userInDB.blackListId) {
            return message.reply(`${anya} **|** O usuário ${target.user.username} não está na blacklist.`);
        }

        const removedUser = await prisma.blackList.delete({
            where: { id: userInDB.blackListId }
        });

        return message.reply(`${confirm_gif} **|** O usuário \`${target.user.username}\` foi removido da blacklist.`);
    } catch (error) {
        console.error("Erro ao remover usuário da blacklist:", error);
        return message.reply("Ocorreu um erro ao remover o usuário da blacklist. Por favor, tente novamente mais tarde.");
    }
}
export default {
    name: "romove.blacklist",
    aliases: ["rm.bk"],
    isOwnerGuild: false,
    permission: [PermissionFlagsBits.SendMessages],
    action: removeBlackList
}