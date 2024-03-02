import { type ICommand } from "../interfaces/ICommand";
import { glob } from "glob";
import { Client, Collection, CommandInteraction, Message, REST, Routes, type Interaction } from "discord.js";
import emoji from "../settings/bot";
import getPrefix from "../utils/getPrefix";
import inBlackList from "../utils/inBlackList";
import "dotenv/config";
import path from "path";
import chalk from "chalk";
const { dirname } = require("path");

const appDir = process.env.PWD || dirname(import.meta.require.main?.filename || "");
const commands: Collection<string, ICommand> = new Collection();

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!!);

const slashs: Collection<string, (interaction: Interaction) => Promise<void>> = new Collection();


export default class CommandHandler {
  isValidModule(module: any): boolean {
    return (
      module.default &&
      typeof module.default === "object" &&
      typeof module.default.name === "string" &&
      typeof module.default.action === "function"
    );
  }

  registerCommand(command: ICommand) {
    commands.set(command.name.toLowerCase(), command);
    for (const alias of command.aliases) {
      commands.set(alias.toLowerCase(), command);
    }
  }

  async loadCommands() {
    try {
      const commandsGlob = await glob("src/commands/prefix/**/*.ts");

      for (const commandPath of commandsGlob) {
        const commandModule = require(appDir + "/" + commandPath);
        if (!this.isValidModule(commandModule)) continue;

        const command: ICommand = commandModule.default;
        this.registerCommand(command);
      }

      console.log(chalk.green("Comandos por"), chalk.bgBlueBright("prefixo"), chalk.green("registrados com sucesso!"));
    } catch (error) {
      console.error(chalk.red("Erro ao carregar comandos por prefixo:"), error);
    }
  }

  async handleCommand(message: Message) {
    if (message.author.bot) return;

    const prefix = await getPrefix(message.guild!!.id);

    if (message.content.startsWith(prefix)) {
      const args = message.content.substring(prefix.length).split(/\s+/);
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName);
      const botOwner = process.env.BOT_OWNERID;
      const anya = emoji.anya;
      if (!command) return;

      const isInBlackList = message.author.id !== botOwner && await inBlackList(message.author.id);
      if (isInBlackList) {
        message.reply({ content: `${anya} **| Você está na minha \`blacklist\`, portante, não deixarei você usar meus comandos!**` });
        return;
      }

      if (command.isOwnerGuild) {
        if (message.author.id !== message.guild?.ownerId) {
          message.reply({ content: `${anya} **| Apenas o dono do servidor pode usar este comando!**` });
          return;
        }
      } else {
        if (!message.member?.permissions.has(command.permission)) {
          message.reply({ content: `${anya} **| Você não tem permissão para usar este comando!**` });
          return;
        }
      }

      command.action(message, args.slice(1));
    }
  }

  async loadSlashCommands(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.inGuild()) {
      await interaction.reply({ ephemeral: true, content: `${emoji.anya} **|** Meus comandos so podem ser executados em servidores, bobinho(a)! ` });
      return;
    }

    try {
      const commandName = interaction.commandName;

      const isInBlackList = interaction.user.id !== process.env.BOT_OWNERID && (await inBlackList(interaction.user.id));
      if (isInBlackList) {
        await interaction.reply({ ephemeral: true, content: `${emoji.anya} **| Você está na minha \`blacklist\`, portanto, não deixarei você usar meus comandos!**` });
        return;
      }

      const commandFunction = slashs.get(commandName);
      if (commandFunction) {
        await commandFunction(interaction);
      } else {
        console.error(`Command function for '${commandName}' not found.`);
      }
    } catch (error) {
      console.error("Error executing command:", error);
    }

  }

  async buildSlashCommands(client: Client) {
    try {
      const commands = [];

      const commandFiles = await glob("src/commands/slash/**/*.ts");

      for (const file of commandFiles) {
        const resolvedPath = path.resolve(appDir, file);
        const commandModule = require(resolvedPath);

        const command = commandModule.default;

        if (command.data && command.execute) {
          commands.push(command.data);
          slashs.set(command.data.name, command.execute);
        }
      }

      await rest.put(
        Routes.applicationCommands(client.user!!.id),
        { body: commands },
      );

      console.log(chalk.green("Comandos por"), chalk.bgBlueBright("slash"), chalk.green("registrados com sucesso!"));
    } catch (error) {
      console.error(chalk.red("Erro ao registrar comandos slash:"), error);
    }
  }
}
