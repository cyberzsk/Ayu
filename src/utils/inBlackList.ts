import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

async function inBlackList(userId: string): Promise<boolean> {
    try {
        const user = await prisma.user.findUnique({
            where: { userid: userId },
            include: { blackLists: true } 
        });

        return !!user?.blackLists; 
    } catch (error) {
        console.error("Erro ao verificar se o usuário está na blacklist:", error);
        return false;
    }
}

export default inBlackList;
