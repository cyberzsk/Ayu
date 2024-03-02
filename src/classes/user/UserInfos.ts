import { EmbedBuilder, type CommandInteraction, Colors } from "discord.js";
import emoji from "../../settings/bot";

const anya = emoji.anya;

export default class UserInfos {

    async getUserBanner(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        const { options } = interaction;

        const targetUser = options.getUser("user")!!.fetch();

        try {

            const bannerUrl = (await targetUser).bannerURL({ size: 2048 });

            if (bannerUrl) {
                const bannerEmbed = new EmbedBuilder({
                    image: { url: bannerUrl },
                    color: Colors.White
                });

                await interaction.reply({ embeds: [bannerEmbed] });
            } else {
                await interaction.reply(`${anya} **|** Este usuário não possui um banner.`);
            }
        } catch (error) {
            console.error("Erro ao obter banner:", error);
            await interaction.reply("Ocorreu um erro ao obter o banner do usuário.");
        }
    }

    async getUserVatar(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        const { options } = interaction;

        const targetUser = options.getUser("user")!!.fetch();

        const avatarUrl = (await targetUser).avatarURL({ size: 2048 });

        if (avatarUrl) {
            let embed = new EmbedBuilder({
                image: { url: avatarUrl },
                color: Colors.White
            });

            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({content: `${anya} **|** Este usuário não possui um avatar.`});
        }
    }
}