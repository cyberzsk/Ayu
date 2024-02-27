import { Client, GatewayIntentBits, Message, Partials } from 'discord.js'
import PrefixCommandRegistry from '../handler';
import getPrefix from '../utils/getPrefix';

export default class Ayu extends Client {
    private prefixCommandRegistry: PrefixCommandRegistry;
    private commandPackage: string;

    constructor(token: string, commandPackage: string) {
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
        this.prefixCommandRegistry = new PrefixCommandRegistry();
        this.token = token;
        this.commandPackage = commandPackage; 
    }

    run() {
        this.login(this.token as string);
        this.on("ready", () => {
            this.user?.setActivity({name: `on ${this.guilds.cache.size} servers`})
            console.log(`Entrei como: ${this.user?.username}!`);
            this.prefixCommandRegistry.registerCommands(this.commandPackage);
        });
    
        this.on("messageCreate", async (message) => {
            const prefix = await getPrefix(message.guild!!.id)
            this.prefixCommandRegistry.handleCommand(message, prefix);
        });
    
    }

}