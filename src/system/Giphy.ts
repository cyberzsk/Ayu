import fetch from 'node-fetch';
import type { GiphyResponse } from '../interfaces/IGiphyResponse';


export default class Giphy {
    constructor(private apiKey: string) {}

    async searchGifs(query: string, limit: number = 20): Promise<any[]> {
        const url = `https://api.giphy.com/v1/gifs/search?api_key=${this.apiKey}&q=${encodeURIComponent(query)}&limit=${limit}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Erro ao buscar GIFs do Giphy: ' + response.statusText);
            }
            
            const responseData: GiphyResponse = await response.json() as GiphyResponse;

            if (responseData && Array.isArray(responseData.data)) {
                return responseData.data;
            } else {
                throw new Error('Resposta inválida recebida da API do Giphy');
            }
        } catch (error) {
            console.error('Erro ao buscar GIFs do Giphy:', error);
            throw error;
        }
    }
}