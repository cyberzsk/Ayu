const { GoogleGenerativeAI } = require("@google/generative-ai");


export default class Gemini {
    private prompt: string;

    constructor(prompt: string) {
        this.prompt = prompt;
    }

    async run(): Promise<string | undefined> {
        const genAI = new GoogleGenerativeAI(process.env.GEMINIAPI_TOKEN);

        try {
            const model = await genAI.getGenerativeModel({ model: "gemini-pro" });

            const result = await model.generateContent(this.prompt);
            const response = await result.response;
            const text = await response.text();

            return text;
        } catch (error) {
            console.error("Erro ao executar o modelo generativo:", error);
            return undefined;
        }
    }
}
