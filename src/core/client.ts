import { Client, GatewayIntentBits, Message, Partials } from 'discord.js'
import SimpleCommandHandler from '../handler/simpleCommandHandler';

export default class Ayu extends Client {
    private simpleCommandHandler: SimpleCommandHandler;

    constructor(token: string) {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
            ],
            partials: [
                Partials.User, Partials.Message,
                Partials.GuildMember, Partials.Channel,
                Partials.GuildScheduledEvent, Partials.Reaction,
                Partials.ThreadMember
            ]
        });
        this.simpleCommandHandler = new SimpleCommandHandler();
        this.token = token;
    }

    run() {
        this.login(this.token as string);
        this.on("ready", async () => {
            this.user?.setActivity({name: `on ${this.guilds.cache.size} servers`})
            console.log(`Entrei como: ${this.user?.username}!`);
            await this.simpleCommandHandler.loadCommands();
        });

        this.on("messageCreate", this.simpleCommandHandler.handleCommand);
    
    }

}