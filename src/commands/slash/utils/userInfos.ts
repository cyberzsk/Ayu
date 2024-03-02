import { ApplicationCommandOptionType, type CommandInteraction } from "discord.js";
import UserInfos from "../../../classes/user/UserInfos";

export default {
    data: {
        name: "user",
        description: "[ Utils ] Veja algo de algum usuário",
        options: [
            {
                name: "banner",
                description: "[ Utils ] Veja o banner de alguém.",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "user",
                        description: "Mencione alguém para ver seu banner",
                        type: ApplicationCommandOptionType.User,
                        required: true
                    }
                ]
            },
            {
                name: "avatar",
                description: "[ Utils ] Veja o avatar de alguém.",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "user",
                        description: "Mencione alguém para ver seu avatar",
                        type: ApplicationCommandOptionType.User,
                        required: true
                    }
                ]
            }
        ]
    },
    execute: async (interaction: CommandInteraction) => {
        if (!interaction.isChatInputCommand()) return;

        const { options } = interaction;
        const userInfos = new UserInfos();

        switch (options.getSubcommand()) {
            case "banner":
                await userInfos.getUserBanner(interaction);
                break;
            case "avatar":
                await userInfos.getUserVatar(interaction);
                break;
        }
    }
};