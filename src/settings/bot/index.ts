import fs from 'fs';

const filePath = 'src/settings/bot/emoji.json';

function readFile(filePath: string): any {
    try {
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(jsonData);
        return data;
    } catch (error) {
        console.error('Erro ao ler o arquivo JSON:', error);
        return null;
    }
}

const emoji = readFile(filePath);


export default emoji
