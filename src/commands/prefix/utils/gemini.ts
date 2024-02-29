import { Message, PermissionFlagsBits } from "discord.js";
import Gemini from "../../../system/GeminiIA";
import emoji from "../../../settings/bot";
import isIAEnabled from "../../../utils/isIAEnabled";

const gemini = async (message: Message, args: string) => {
    try {
        const loading = emoji.loading;
        const msg = await message.reply({ content: `${loading} Aguarde uns segundos...` });

        const iaEnabled = await isIAEnabled(message.guild?.id || "");
        if (!iaEnabled) {
            await msg.edit("A IA não está ativada neste servidor.");
            return;
        }

        const geminiAI = new Gemini(args);
        const response = await geminiAI.run();

        if (response) {
            await msg.edit(response);
        } else {
            await msg.edit("Não foi possível obter uma resposta da IA no momento.");
        }
    } catch (error) {
        console.error("Erro ao executar o gemini:", error);
        message.channel.send("Ocorreu um erro ao tentar obter uma resposta da IA.");
    }
};

export default {
    name: "a",
    aliases: ["ia"],
    isOwnerGuild: false,
    permission: [PermissionFlagsBits.SendMessages],
    action: gemini
};