declare namespace NodeJS {
    interface ProcessEnv {
        DISCORD_TOKEN: string;
        DATABASE_URL: string;
        SQUARECLOUD_TOKEN: string;
        SQUARECLOUD_ID: string;
        GIPHYAPI_TOKEN: string;
        GEMINIAPI_TOKEN: string;
        BOT_OWNERID: string;
    }
}