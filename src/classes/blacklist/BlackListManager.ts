import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Colors, CommandInteraction, EmbedBuilder } from "discord.js";
import emoji from "../../settings/bot";
import { PrismaClient } from "@prisma/client";
import { type CreatePaginationOptions, createPagination } from "../../functions/pagination";

const prisma = new PrismaClient();
const anya = emoji.anya;
const confirm_gif = emoji.confirm_gif;


export default class BlackListManager {

    async view(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true, fetchReply: true });
        try {
            const blacklistedUsers = await prisma.user.findMany({
                where: {
                    blackListId: {
                        not: null
                    }
                }
            });


            if (blacklistedUsers.length === 0) {
                await interaction.editReply({ content: `${anya} **|** Não há ninguém na minha \`BlackList\`` });
                return;
            }

            const embeds = await Promise.all(blacklistedUsers.map(async (user) => {
                const fetchedUser = await interaction.client.users.fetch(user.userid).catch(console.error);
                const avatarURL = fetchedUser?.displayAvatarURL() || "";

                return new EmbedBuilder()
                    .setAuthor({ name: `${user.username}`, iconURL: avatarURL })
                    .setDescription(`> **ID:** \`${user.userid}\`\n> **Username:** \`${user.username || "Não definido"}\``)
                    .setColor(0xFF0000)
                    .setThumbnail(avatarURL);
            }));

            const paginationOptions: CreatePaginationOptions = {
                embeds,
                render: (embeds, components) => interaction.editReply({
                    embeds, components
                }),
                onUpdate: (embed, index, length) => {
                    embed.setFooter({ text: `Página ${index + 1}/${length}` });
                },
            };
            await createPagination(paginationOptions);

        } catch (error) {
            console.error("Erro ao obter usuários da blacklist:", error);
            await interaction.editReply("Ocorreu um erro ao obter usuários da blacklist.");
        }
    }


    async remove(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });
        const targetMember = interaction.options.getUser("user");

        if (!targetMember) {
            await interaction.editReply("❌ **|** Você precisa mencionar o usuário para removê-lo da blacklist.");
            return;
        }

        try {
            const userInDB = await prisma.user.findUnique({
                where: { userid: targetMember.id }
            });

            if (!userInDB || !userInDB.blackListId) {
                await interaction.editReply(`${anya} **|** O usuário \`${targetMember.displayName}\` não está na blacklist.`);
                return;
            }

            await prisma.blackList.delete({
                where: { id: userInDB.blackListId }
            });

            await interaction.editReply(`${confirm_gif} **|** O usuário \`${targetMember.displayName}\` foi removido da blacklist.`);
        } catch (error) {
            console.error("Erro ao remover usuário da blacklist:", error);
            await interaction.editReply("Ocorreu um erro ao remover o usuário da blacklist. Por favor, tente novamente mais tarde.");
        }
    }

    async add(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const targetMember = interaction.options.getUser("user");

        if (!targetMember) {
            await interaction.editReply("❌ **|** Você precisa mencionar o usuário para adicionar à blacklist.");
            return;
        }

        if (targetMember.bot) {
            await interaction.editReply({ content: "❌ **|** Você não pode adicionar Bots à blacklist." });
            return;
        }

        try {
            const userInDB = await prisma.user.findUnique({
                where: { userid: targetMember.id }
            });

            if (userInDB && userInDB.blackListId) {
                await interaction.editReply(`${anya} **|** O usuário \`${targetMember.displayName}\` já está na blacklist.`);
                return;
            }

            const confirmButton = new ButtonBuilder()
                .setCustomId("button_confirm_blacklist")
                .setLabel("Confirmar")
                .setStyle(ButtonStyle.Success);

            const cancelButton = new ButtonBuilder()
                .setCustomId("button_cancel")
                .setLabel("Cancelar")
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmButton, cancelButton);

            const embed = new EmbedBuilder({
                description: `## ${anya} **|** Você confirma esta ação?\n- **Usuário a ser punido:** ${targetMember.displayName}(\`${targetMember.id}\`)\n- **Author da punição:** ${interaction.user.username}(\`${interaction.user.id}\`) `,
                color: Colors.White
            });

            const confirmationMessage = await interaction.editReply({
                embeds: [embed],
                components: [row]
            });

            const collector = confirmationMessage.createMessageComponentCollector({ max: 1, time: 30000 });

            collector.on("collect", async (interaction: ButtonInteraction) => {
                if (interaction.customId === "button_confirm_blacklist") {
                    try {
                        let userInDB = await prisma.user.findUnique({
                            where: { userid: targetMember.id }
                        });

                        if (!userInDB) {
                            userInDB = await prisma.user.create({
                                data: {
                                    userid: targetMember.id,
                                    username: targetMember.displayName,
                                    blackLists: {
                                        create: {
                                            punished: true,
                                            authorId: interaction.user.id,
                                            authorName: interaction.user.username,
                                            punishedId: targetMember.id,
                                            punishedName: targetMember.displayName
                                        }
                                    }
                                },
                                include: { blackLists: true }
                            });

                            await interaction.update({
                                content: `${confirm_gif} **|** O usuário \`${userInDB.username}\` foi adicionado à blacklist.`,
                                embeds: [],
                                components: []
                            });
                        } else {
                            const updatedUser = await prisma.user.update({
                                where: { userid: targetMember.id },
                                data: {
                                    blackLists: {
                                        create: {
                                            punished: true,
                                            authorId: interaction.user.id,
                                            authorName: interaction.user.username,
                                            punishedId: targetMember.id,
                                            punishedName: targetMember.displayName
                                        }
                                    }
                                },
                                include: { blackLists: true }
                            });

                            await interaction.update({
                                content: `${confirm_gif} **|** O usuário \`${updatedUser.username}\` foi adicionado à minha **Blacklist**.`,
                                embeds: [],
                                components: []
                            });
                        }
                    } catch (error) {
                        console.error("Erro ao adicionar usuário à blacklist:", error);
                        await interaction.update({
                            content: "Ocorreu um erro ao adicionar o usuário à blacklist. Por favor, tente novamente mais tarde.",
                            components: []
                        });
                    }
                } else if (interaction.customId === "button_cancel") {
                    await interaction.update({
                        content: `${confirm_gif} **|** Ação cancelada!`,
                        embeds: [],
                        components: []
                    });
                }
            });

            collector.on("end", async (collected) => {
                if (collected.size === 0) {
                    await confirmationMessage.edit({
                        content: `${anya} **| O tempo para confirmar expirou.**`,
                        embeds: [],
                        components: []
                    });
                }
            });
        } catch (error) {
            console.error("Erro ao adicionar usuário à blacklist:", error);
            return interaction.editReply("Ocorreu um erro ao adicionar o usuário à blacklist. Por favor, tente novamente mais tarde.");
        }
    }
}