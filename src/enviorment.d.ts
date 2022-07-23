declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            botId: string;
            guildId: string;
            mongodbUri: string;
            port: number;
            embedColor: string;
            enviorment: "dev" | "prod" | "debug";
        }
    }
}

export {};