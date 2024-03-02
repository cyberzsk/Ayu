const { GoogleGenerativeAI } = require("@google/generative-ai");


export default class Gemini {
    private prompt: string;

    constructor(prompt: string) {
        this.prompt = prompt;
    }

    async run(): Promise<string | undefined> {
        const genAI = new GoogleGenerativeAI(process.env.GEMINIAPI_TOKEN);

        try {
            const generationConfig = {
                stopSequences: ["red"],
                maxOutputTokens: 200,
                temperature: 0.9,
                topP: 0.1,
                topK: 16,
            };

            const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });

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



