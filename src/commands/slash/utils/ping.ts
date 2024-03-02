import type { CommandInteraction } from "discord.js";
import emoji from "../../../settings/bot";

export default {
    data: {
        name: "ping",
        description: "[ Utils ] Responde com o ping do bot.",
    },
    execute: (interaction: CommandInteraction) => {
        interaction.reply({ content: "Pong 🏓" }).then((msg) => {
            setTimeout(() => {
                const network = emoji.network;
                const ping = interaction.client.ws.ping;
                msg.edit({content: `${network} **|** Ping: \`${ping}\`ms`});
            }, 3000);
        }).catch(console.error);
    }
};