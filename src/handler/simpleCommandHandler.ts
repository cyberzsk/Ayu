import { type ICommand } from '../interfaces/ICommand';
import { glob } from 'glob';
import { Collection, type Message } from 'discord.js';
import emoji from '../settings/bot';
import getPrefix from '../utils/getPrefix';
const { dirname } = require('path');

const appDir = process.env.PWD || dirname(import.meta.require.main?.filename || '');
const commands: Collection<string, ICommand> = new Collection();

export default class SimpleCommandHandler {
  isValidModule(module: any): boolean {
    return module.default &&
      typeof module.default === 'object' &&
      typeof module.default.name === 'string' &&
      typeof module.default.action === 'function';
  }

  registerCommand(command: ICommand) {
    commands.set(command.name.toLowerCase(), command);
    for (const alias of command.aliases) {
      commands.set(alias.toLowerCase(), command);
    }
  }
  
  async loadCommands() {
    const commandsGlob = await glob('src/commands/prefix/**/*.ts');
    for (const commandPath of commandsGlob) {
      const commandModule = require(appDir + '/' + commandPath);
      if (!this.isValidModule(commandModule)) return;
      
      const command: ICommand = commandModule.default;
      this.registerCommand(command);
      console.log(`Command '${command.name}' registered!`);
    }
  }

  async handleCommand(message: Message) {
    if (message.author.bot) return;

    const prefix = await getPrefix(message.guild!!.id)

    if (message.content.startsWith(prefix)) {
      const args = message.content.substring(prefix.length).split(/\s+/);
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName);
      if (!command) return;

      if (command.isOwnerGuild) {
        const anya = emoji.anya;
        if (message.author.id !== message.guild?.ownerId) {
          message.reply({ content: `${anya} | Apenas o dono do servidor pode usar este comando!` });
          return;
        }
      } else {
        if (!message.member?.permissions.has(command.permission)) {
          message.reply({ content: "Você não tem permissão para usar este comando!" });
          return;
        }
      }

      command.action(message, args.slice(1));
    }
  }
}
