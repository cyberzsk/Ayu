import { EmbedBuilder, Message, PermissionFlagsBits } from "discord.js";
import SquareCloud from "../../../system/SquareCloud";
import "dotenv/config";
import emoji from "../../../settings/bot";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusCommand = async (message: Message) => {
    try {
        const appId: string = process.env.SQAURECLOUD_ID;
        const token: string = process.env.SQUARECLOUD_TOKEN;

        const squareCloud: SquareCloud = new SquareCloud(appId, token);

        const ram: string = emoji.ram;
        const cpu: string = emoji.cpu;
        const loading: string = emoji.loading;
        const ssd: string = emoji.ssd;
        const network: string = emoji.network;
        const square: string = emoji.square;

        const appStatus = await squareCloud.getAppStatus();

        const uptimeFormatted = formatDistanceToNow(new Date(appStatus.uptime), { addSuffix: true, locale: ptBR });

        const embed = new EmbedBuilder({
            thumbnail: { url: "https://i.imgur.com/9Vzc9AQ.png" },
            description: `
                ## ${square} Informações da \`${message.client.user.username}\`
        
                ${cpu} - **CPU:** \`${appStatus.cpu}\`
                ${ram} - **RAM:** \`${appStatus.ram}\`
                ${loading} - **Status:** \`${appStatus.status}\`
                ${ssd} - **Storage:** \`${appStatus.storage}\`
                🕔 - **Uptime:** \`${uptimeFormatted}\`
                ${network} - **Rede:** \`${appStatus.network.total}\` **&** \`${appStatus.network.now}\`
            `,
            color: 0xFFFFFF,
            footer: { text: "Estas são minhas informações atuais na SquareCloud", iconURL: "https://i.imgur.com/9Vzc9AQ.png" }
        });

        message.reply({ embeds: [embed] }).then((msg: Message) => {
            setTimeout(() => {
                msg.delete();
            }, 30000);
        }).catch((error: Error) => {
 console.error(error); 
});
    } catch (error) {
        console.error("Erro ao buscar status do aplicativo:", error);
        message.channel.send("Ocorreu um erro ao buscar o status do aplicativo. Por favor, tente novamente mais tarde.");
    }
};

export default {
    name: "status",
    aliases: ["st"],
    isOwnerGuild: false,
    permission: [PermissionFlagsBits.SendMessages],
    action: statusCommand
};