import { Message, PermissionFlagsBits } from "discord.js";
import emoji from "../../../settings/bot";
import "dotenv/config";
import getPrefix from "../../../utils/getPrefix";

const setAvatar = async (message: Message, args: string[]) => {
    if (message.author.id !== process.env.BOT_OWNERID) {
        return;
    }

    const confirm_gif = emoji.confirm_gif;
    const anya = emoji.anya;

    const prefix = await getPrefix(message.guild!!.id);

    if (args[0] !== "avatar" && message.content !== `${prefix}st.av`) {
        return;
    }

    if (message.attachments.size === 0) {
        return message.channel.send(`${anya} **|** ${message.author} Você precisa anexar uma imagem após o comando \`${prefix}set avatar\`.`);
    }


    message.attachments.forEach(attachment => {
        if (attachment.contentType && attachment.contentType.startsWith("image")) {
            const imageUrl = attachment.url;
            message.client.user.setAvatar(imageUrl)
                .then(() => {
                    message.reply({ content: `${confirm_gif} **|** Avatar atualizado com sucesso!` });
                })
                .catch(error => {
                    console.error("Erro ao definir o avatar:", error);
                    message.reply({ content: `${anya} **|** Ocorreu um erro ao definir o avatar.` });
                });
        } else {
            message.channel.send(`${anya} **|** ${message.author} O anexo não é uma imagem ou não possui um tipo de conteúdo definido.`);
        }
    });
};

export default {
    name: "set",
    aliases: ["st.av"],
    isOwnerGuild: false,
    permission: [PermissionFlagsBits.SendMessages],
    action: setAvatar
};
