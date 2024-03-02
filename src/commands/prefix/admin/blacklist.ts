import { PrismaClient } from "@prisma/client";
import { PermissionFlagsBits, Message, ButtonInteraction, Collection, EmbedBuilder } from "discord.js";
import { createPagination, type CreatePaginationOptions } from "../../../functions/pagination";
import emoji from "../../../settings/bot";


const prisma = new PrismaClient();

export default {
    name: "blacklist",
    aliases: [],
    isOwnerGuild: false,
    permission: [PermissionFlagsBits.SendMessages],
    action: async (message: Message) => {
        try {
            const blacklistedUsers = await prisma.user.findMany({
                where: {
                    blackListId: {
                        not: null
                    }
                }
            });

            const anya = emoji.anya;

            if (blacklistedUsers.length === 0) {
                message.reply({ content: `${anya} **|** Não há ninguém na minha \`BlackList\`` });
                return;
            }

            const embeds = await Promise.all(blacklistedUsers.map(async (user) => {
                const fetchedUser = await message.client.users.fetch(user.userid).catch(console.error);
                const avatarURL = fetchedUser?.displayAvatarURL() || "";

                return new EmbedBuilder()
                    .setAuthor({ name: `${user.username}`, iconURL: avatarURL })
                    .setDescription(`> **ID:** \`${user.userid}\`\n> **Username:** \`${user.username || "Não definido"}\``)
                    .setColor(0xFF0000)
                    .setThumbnail(avatarURL);
            }));


            let originalMessage: Message | null = null;

            const paginationOptions: CreatePaginationOptions = {
                embeds,
                render: async (embeds, components) => {
                    const reply = await message.reply({ embeds, components });
                    originalMessage = reply instanceof Message ? reply : null; 
                    return reply;
                },
                filter: (interaction: ButtonInteraction) => {
                    return interaction.user.id === message.author.id;
                },
                onUpdate: (embed, index, length) => {
                    embed.setFooter({ text: `Página ${index + 1}/${length}` });
                },
                onEnd: () => {
                    if (originalMessage) originalMessage.delete(); 
                },
                time: 160_000,
                onTimeout: async () => {
                    if (originalMessage) {
                        await originalMessage.edit({
                            content: `${anya} **|** ${originalMessage.author} Tempo esgotado. A paginação foi encerrada.`,
                            embeds: [],
                            components: []
                        });
                    }
                },
            };
            await createPagination(paginationOptions);

        } catch (error) {
            console.error("Erro ao obter usuários da blacklist:", error);
            message.channel.send("Ocorreu um erro ao obter usuários da blacklist.");
        }
    }
};