import { PrismaClient } from "@prisma/client";
import { PermissionFlagsBits, type Message, ButtonBuilder, ButtonStyle, ActionRowBuilder, ButtonInteraction, type CollectorFilter, EmbedBuilder, Colors, GuildMember, User } from "discord.js";
import emoji from "../../../settings/bot";
import "dotenv/config";

const prisma = new PrismaClient();


const addToBlacklist = async (message: Message, args: string[]) => {
    const anya = emoji.anya;
    const confirmGif = emoji.confirm_gif;

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

    if (target instanceof GuildMember && target.user.bot) {
        return message.reply({ content: "❌ **|** Você não pode adicionar Bots à minha blacklist." });
    }

    try {
        let userInDB = await prisma.user.findUnique({
            where: { userid: target.id }
        });

        if (userInDB && userInDB.blackListId) {
            return message.reply(`${anya} **|** O usuário ${target.displayName} já está na blacklist.`);
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
            description: `## ${anya} **|** Você confirma esta ação?\n- **Usuario a ser punido:** ${target.displayName}(\`${target?.id}\`)\n- **Author da punição:** ${message.author.username}(\`${message.author.id}\`) `,
            color: Colors.White
        });

        const confirmationMessage = await message.reply({
            embeds: [embed],
            components: [row]
        });

        const collector = confirmationMessage.createMessageComponentCollector({ max: 1, time: 30000 });

        collector.on("collect", async (interaction: ButtonInteraction) => {
            if (interaction.customId === "button_confirm_blacklist") {
                try {
                    if (interaction.user.id != message.author.id) {
                        interaction.reply({ ephemeral: true, content: `${anya} **| Esta interação não é para você**` });
                        return;
                    }

                    let userInDB = await prisma.user.findUnique({
                        where: { userid: target?.id }
                    });

                    if (!userInDB) {
                        userInDB = await prisma.user.create({
                            data: {
                                userid: target!!.id,
                                username: target?.displayName,
                                blackLists: {
                                    create: {
                                        punished: true,
                                        authorId: message.author.id,
                                        authorName: message.author.username,
                                        punishedId: target?.id,
                                        punishedName: target?.displayName
                                    }
                                }
                            },
                            include: { blackLists: true }
                        });

                        await interaction.update({
                            content: `${confirmGif} **|** O usuário ${userInDB.username} foi adicionado à blacklist.`,
                            embeds: [],
                            components: []
                        });
                    } else {
                        const updatedUser = await prisma.user.update({
                            where: { userid: target?.id },
                            data: {
                                blackLists: {
                                    create: {
                                        punished: true,
                                        authorId: message.author.id,
                                        authorName: message.author.username,
                                        punishedId: target?.id,
                                        punishedName: target?.displayName
                                    }
                                }
                            },
                            include: { blackLists: true }
                        });

                        await interaction.update({
                            content: `${confirmGif} **|** O usuário \`${updatedUser.username}\` foi adicionado à minha **Blacklist**.`,
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
            } else if (interaction.customId == "button_cancel") {
                await interaction.update({
                    content: `${confirmGif} **|** Ação cancelada!`,
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
        return message.reply("Ocorreu um erro ao adicionar o usuário à blacklist. Por favor, tente novamente mais tarde.");
    }
};

export default {
    name: "add.blacklist",
    aliases: ["add.bl"],
    isOwnerGuild: false,
    permission: [PermissionFlagsBits.SendMessages],
    action: addToBlacklist
};