import { ApplicationCommandOptionType, ApplicationCommandType, type CommandInteraction } from "discord.js";
import emoji from "../../../settings/bot";
import "dotenv/config";

export default {
    data: {
        name: "setar",
        description: "[ Admin ] Tenha acesso as minhas configurações.",
        type: ApplicationCommandType.ChatInput,
        dmPermission: false,
        options: [
            {
                name: "avatar",
                description: "[ Admin ] Mude meu avatar atráves desse comando.",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "avatar",
                        description: "Selecione meu avatar",
                        type: ApplicationCommandOptionType.Attachment,
                        required: true
                    }
                ]
            }
        ]
    },
    execute: async (interaction: CommandInteraction) => {
        if (!interaction.isChatInputCommand()) return;
        await interaction.deferReply();

        if (interaction.user.id != process.env.BOT_OWNERID) {
            await interaction.editReply({ content: "❌ **|** Este comando é exclusivo para os meus desenvolvedores! " });
            return;
        }

        const { options } = interaction;
        const subcommand = options.getSubcommand();
        const confirm_gif = emoji.confirm_gif;

        switch (subcommand) {
            case "avatar":

                const avatarAttachment = options.getAttachment("avatar")!!;

                try {
                    await interaction.client.user?.setAvatar(avatarAttachment.url);
                    await interaction.editReply({ content: `${confirm_gif} **|** Avatar atualizado com sucesso! ` });
                } catch (error) {
                    console.error("Erro ao definir o avatar:", error);
                    await interaction.editReply({ content: "❌ **|** Ocorreu um erro ao definir o avatar." });
                }
                break;

        }
    }
};