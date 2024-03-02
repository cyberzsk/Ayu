import { Client, CommandInteraction, GatewayIntentBits, Partials, type CacheType, ChatInputCommandInteraction } from "discord.js";
import CommandHandler from "../handler/commandHandler";
import chalk from "chalk";


export default class Ayu extends Client {
    private simpleCommandHandler: CommandHandler;

    constructor(token: string) {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent
            ],
            partials: [
                Partials.User, Partials.Message,
                Partials.GuildMember, Partials.Channel,
                Partials.GuildScheduledEvent, Partials.Reaction,
                Partials.ThreadMember
            ],
            failIfNotExists: false
        });
        this.simpleCommandHandler = new CommandHandler();
        this.token = token;
    }

    async run() {
        this.login(this.token as string);
        this.on("ready", async () => {
            this.user?.setActivity({ name: `on ${this.guilds.cache.size} servers` });
            await this.simpleCommandHandler.loadCommands();

            await this.simpleCommandHandler.buildSlashCommands(this);

            console.log(chalk.blueBright("Entrei como:"), chalk.gray(this.user?.username + "!"));

        });

        this.on("messageCreate", this.simpleCommandHandler.handleCommand);

        this.on("interactionCreate", async (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            await this.simpleCommandHandler.loadSlashCommands(interaction);
        });
    }
}