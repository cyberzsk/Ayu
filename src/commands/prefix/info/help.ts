import { Colors, EmbedBuilder, Message, PermissionFlagsBits } from "discord.js";
import emoji from "../../../settings/bot";

export default {
    name: "help",
    aliases: ["ajuda"],
    isOwnerGuild: false,
    permission: [PermissionFlagsBits.SendMessages],
    action: async (message: Message, args: string) => {
        const confirm_gif = emoji.confirm_gif;
        const embed = new EmbedBuilder({
            description: "",
            color: Colors.White
        });

        const user = message.client.users.fetch(message.author.id);

        try {
            if (user !== null) {
                (await user).send({ content: `${confirm_gif} **| Verifique sua \`DM\`** `, embeds: [embed] });
            }
        } catch (error) {
            message.reply({ embeds: [embed] });
        }
    }
};