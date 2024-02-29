import { EmbedBuilder, Message, PermissionFlagsBits, User } from "discord.js";
import "dotenv/config";
import Giphy from "../../../system/Giphy";
import emoji from "../../../settings/bot";
import getPrefix from "../../../utils/getPrefix";


const hugCommand = async (message: Message) => {
    const mentionedUser: User | undefined = message.mentions.users.first();
    const prefix = await getPrefix(message.guild!!.id);

    if (!mentionedUser) {
        message.reply({content: `Você precisa mencionar alguém após o comando, exemplo: **${prefix}hug \`<@sanji>\`**`});
        return;
    }

    const query = "anime hug";

    const giphyClient = new Giphy();
    const power = emoji.powerhug;

    try {
        const gifs = await giphyClient.searchGifs(query);


        const randomIndex = Math.floor(Math.random() * gifs.length);
        const randomGif = gifs[randomIndex];

        const responseMessage = mentionedUser.bot ? `# ${power} ${message.author} abaraçou um bot¿?` : `# ${power} - ${message.author} abraçou ${mentionedUser}`;


        const gifUrl = randomGif.images.original.url;
        const source = randomGif.title;

        const embed = new EmbedBuilder({
            image: { url: gifUrl, height: 1024, width: 200 },
            footer: { text: `Fonte: ${source}` },
            color: 0xffffff
        });

        message.reply({ content: responseMessage, embeds: [embed] });
    } catch (error) {
        console.error("Erro ao pesquisar GIFs no Giphy:", error);
        message.channel.send("Ocorreu um erro ao buscar GIFs no Giphy. Por favor, tente novamente mais tarde.");
    }
};

export default {
    name: "hug",
    aliases: ["abraçar", "abracar"],
    isOwnerGuild: false,
    permission: [PermissionFlagsBits.SendMessages],
    action: hugCommand
};