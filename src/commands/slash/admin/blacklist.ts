import { ApplicationCommandOptionType, ApplicationCommandType, type CommandInteraction } from "discord.js";
import "dotenv/config";
import BlackListManager from "../../../classes/blacklist/BlackListManager";

export default {
    data: {
        name: "blacklist",
        description: "[ Admin ] Configure minha BlackList.",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "vizualizar",
                description: "[ Admin ] Veja as pessoas que foram para na minha blacklist",
                type: ApplicationCommandOptionType.Subcommand
            },
            {
                name: "adcionar",
                description: "[ Admin ] Adicione alguém à minha BlackList.",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "user",
                        description: "Usuário a ser adicionado à BlackList.",
                        type: ApplicationCommandOptionType.User,
                        required: true
                    }
                ]
            },
            {
                name: "remover",
                description: "[ Admin ] Remova alguém à minha BlackList.",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "user",
                        description: "Usuário a ser removido à BlackList.",
                        type: ApplicationCommandOptionType.User,
                        required: true
                    }
                ]
            }
        ],
        dmPermission: false,
    },
    execute: async (interaction: CommandInteraction) => {
        if (!interaction.isChatInputCommand()) {
            return;
        }

        if (interaction.user.id !== process.env.BOT_OWNERID) {
            interaction.reply({ephemeral: true, content: "❌ **|** Este comando é exclusivo para meus donos!"});
            return;
        }

        const { options } = interaction;

        const blacklist = new BlackListManager();
        const subcommandName = options.getSubcommand();

        switch (subcommandName) {
            case "vizualizar":
                await blacklist.view(interaction);
                break;
            case "adcionar":
                await blacklist.add(interaction);
                break;
            case "remover":
                await blacklist.remove(interaction);
                break;
        }
    }
};