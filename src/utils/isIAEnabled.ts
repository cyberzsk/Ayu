import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function isIAEnabled(guildId: string): Promise<boolean> {
    try {
        const guild = await prisma.guild.findUnique({
            where: { guildId },
        });

        if (!guild || !guild.ia) {
            return false;
        }

        return true;
    } catch (error) {
        console.error("Erro ao verificar se a IA está ativada:", error);
        return false;
    }
}

export default isIAEnabled;