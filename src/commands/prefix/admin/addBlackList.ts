import { PrismaClient } from "@prisma/client"
import { PermissionFlagsBits, type Message, ButtonBuilder, ButtonStyle, ActionRowBuilder, ButtonInteraction, type CollectorFilter, EmbedBuilder, Colors } from "discord.js"
import emoji from "../../../settings/bot"
import "dotenv/config"

const prisma = new PrismaClient()

const addToBlacklist = async (message: Message, args: string[]) => {
    const anya = emoji.anya;
    const confirmGif = emoji.confirm_gif

    if (message.author.id != process.env.BOT_OWNERID) {
        return message.reply(` ${anya} **|** Este comando é exclusivo para meus donos!`);
    }

    const review = emoji.review;

    const target = message.mentions.members?.first();
    if (!target) {
        return message.reply("❌ **|** Você precisa mencionar o usuário que deseja adicionar à blacklist.");
    }

    const confirmButton = new ButtonBuilder()
        .setCustomId('button_confirm_blacklist')
        .setLabel('Confirmar')
        .setStyle(ButtonStyle.Success);

    const cancelButton = new ButtonBuilder()
        .setCustomId('button_cancel')
        .setLabel("Cancelar")
        .setStyle(ButtonStyle.Danger)

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmButton, cancelButton);

    const embed = new EmbedBuilder({
        description: `## ${anya} **|** Você confirma esta ação?\n- ${review} **- Usuario a ser punido:** ${target.user.username}(\`${target.user.id}\`)\n- 👮‍♂️ **- Author da punição:** ${message.author.username}(\`${message.author.id}\`) `,
        color: Colors.White
    });

    const confirmationMessage = await message.reply({
        embeds: [embed],
        components: [row]
    });

    const collector = confirmationMessage.createMessageComponentCollector({ max: 1, time: 30000 });

    collector.on('collect', async (interaction: ButtonInteraction) => {
        if (interaction.customId === 'button_confirm_blacklist') {
            try {
                let userInDB = await prisma.user.findUnique({
                    where: { userid: target.id }
                });

                if (!userInDB) {
                    userInDB = await prisma.user.create({
                        data: {
                            userid: target.id,
                            username: target.user.username,
                            blackLists: {
                                create: {
                                    punished: true,
                                    authorId: message.author.id,
                                    authorName: message.author.username,
                                    punishedId: target.user.id,
                                    punishedName: target.user.username
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
                    if (userInDB.blackListId) {
                        await interaction.update({
                            content: `${anya} **|** O usuário ${target.user.username} já está na blacklist.`,
                            embeds: [],
                            components: []
                        });
                    } else {
                        const updatedUser = await prisma.user.update({
                            where: { userid: target.id },
                            data: {
                                blackLists: {
                                    create: {
                                        punished: true,
                                        authorId: message.author.id,
                                        authorName: message.author.username,
                                        punishedId: target.user.id,
                                        punishedName: target.user.username
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
            })
        }
    });

    collector.on('end', async (collected) => {
        if (collected.size === 0) {
            await confirmationMessage.edit({
                content: 'O tempo para confirmar expirou.',
                embeds: [],
                components: []
            });
        }
    });
};

export default {
    name: "add.blacklist",
    aliases: [],
    isOwnerGuild: false,
    permission: [PermissionFlagsBits.SendMessages],
    action: addToBlacklist
}