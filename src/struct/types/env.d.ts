declare namespace NodeJS {
  interface ProcessEnv {
    BOT_TOKEN: string;
    CLIENT_ID: string;
    GUILD_ID: string;
    MONGO_HOST: string;
    MONGO_DATABASE: string;
    CHANNEL_SERVER_LOGS_ID: string;
    CHANNEL_ADMIN_COMMANDS_ID: string;
    REQUIRED_ROLE_ID: string; 
    ROTS_API_URL: string;
    ROTS_SERVER_NAME: string;      
  }
}