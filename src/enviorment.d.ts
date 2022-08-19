declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            clientId: string;
            guildId: string;
            mongodbUri: string;
            port: number;
            embedColor: string;
            key: string;
            cert: string;
            adminPrefix: string;
            adminId: string;
            NODE_ENV: "dev" | "prod" | "debug";
            clientSecret: string;
            redirectURL: string;
            cookieSecret: string;
        }
    }
    declare module "*.png" {
        const value: any;
        export = value;
    }
}

export { };