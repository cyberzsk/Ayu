export default class SquareCloud {
    constructor(private appId: string, private authorization: string) { }

    async getAppStatus(): Promise<any> {
        const url = `https://api.squarecloud.app/v2/apps/${this.appId}/status`;
        const options = {
            method: "GET",
            headers: {
                Authorization: this.authorization
            }
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error("Erro ao buscar status do aplicativo: " + response.statusText);
            }
            const data = await response.json();

            if (typeof data === "object" && data !== null && "response" in data) {
                return data.response;
            } else {
                throw new Error("Resposta inválida recebida da API");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
