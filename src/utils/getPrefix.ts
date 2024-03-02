import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getPrefix(guildId: string): Promise<string> {
    try {
        const guild = await prisma.guild.findUnique({
            where: { guildId },
        });

        if (guild) {
            return guild.prefix as string;
        } else {
            return "a?";
        }
    } catch (error) {
        console.error("Erro ao buscar o prefixo do servidor:", error);
        throw new Error("Ocorreu um erro ao buscar o prefixo do servidor.");
    }
}

export default getPrefix;