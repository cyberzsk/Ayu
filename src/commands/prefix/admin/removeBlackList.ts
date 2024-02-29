import { PrismaClient } from "@prisma/client";
import { PermissionFlagsBits, type Message, GuildMember, User } from "discord.js"
import emoji from "../../../settings/bot";

const prisma = new PrismaClient();

const removeBlackList = async (message: Message, args: string[]) => {
    const anya = emoji.anya;
    const confirm_gif = emoji.confirm_gif
    let target: GuildMember | User | undefined = undefined;

    if (message.mentions.members?.size) {
        target = message.mentions.members.first()!;
    } else {
        const userId = args[0];
        if (userId) {
            try {
                const user = await message.client.users.fetch(userId);
                const guildMember = message.guild?.members.cache.get(user.id);
                target = guildMember || user;
            } catch (error) {
                return message.reply(`${anya} **| ID ou usuário inválido!**`);
            }
        }
    }

    if (!target) {
        return message.reply("❌ **|** Você precisa mencionar o usuário ou fornecer um ID válido para adicionar à blacklist.");
    }


    try {
        const userInDB = await prisma.user.findUnique({
            where: { userid: target.id }
        });

        if (!userInDB || !userInDB.blackListId) {
            return message.reply(`${anya} **|** O usuário \`${target.displayName}\` não está na blacklist.`);
        }

        const removedUser = await prisma.blackList.delete({
            where: { id: userInDB.blackListId }
        });

        return message.reply(`${confirm_gif} **|** O usuário \`${target.displayName}\` foi removido da blacklist.`);
    } catch (error) {
        console.error("Erro ao remover usuário da blacklist:", error);
        return message.reply("Ocorreu um erro ao remover o usuário da blacklist. Por favor, tente novamente mais tarde.");
    }
}
export default {
    name: "remove.blacklist",
    aliases: ["rm.bl"],
    isOwnerGuild: false,
    permission: [PermissionFlagsBits.SendMessages],
    action: removeBlackList
}