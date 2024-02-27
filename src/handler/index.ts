import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { Message, type PermissionResolvable } from 'discord.js';
import emoji from '../settings/bot';

export interface Command {
    name: string;
    action: CommandAction;
    isOwnerGuild: boolean;
    permission: PermissionResolvable[]
    aliases: string[];
}

export interface CommandAction {
    (message: Message, args: string[]): void;
}

export default class PrefixCommandRegistry {
    private commandActions: Map<string, Command> = new Map();

    registerCommands(commandDirectory: string): void {
        try {
            this.loadCommands(commandDirectory);
            console.log("Comandos por prefixo carregados com sucesso.");
        } catch (error) {
            console.error("Erro ao carregar comandos por prefixo:", error);
        }
    }

    private loadCommands(directory: string): void {
        const files = readdirSync(directory);
        for (const file of files) {
            const fullPath = join(directory, file);
            const fileStat = statSync(fullPath);
            if (fileStat.isDirectory()) {
                this.loadCommands(fullPath);
            } else if (file.endsWith('.ts')) {
                const commandModule = require(fullPath);
                if (commandModule.default && typeof commandModule.default === 'object' && typeof commandModule.default.name === 'string' && typeof commandModule.default.action === 'function') {
                    const command: Command = commandModule.default;
                    this.commandActions.set(command.name.toLowerCase(), command);
                    command.aliases.forEach((alias: string) => {
                        this.commandActions.set(alias.toLowerCase(), command);
                    });

                    console.log(`Comando '${command.name}' registrado com sucesso.`);
                }
            }
        }
    }

    handleCommand(message: Message, prefix: string): void {
        if (message.author.bot) return;
    
        const content = message.content;
        if (content.startsWith(prefix)) {
            const args = content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift()?.toLowerCase(); 
            if (!commandName) return; 
            const command = this.commandActions.get(commandName);
            if (command) {
                const anya = emoji.anya;
                if (command.isOwnerGuild) {
                    if (message.author.id !== message.guild?.ownerId) {
                        message.reply({ content: `${anya} | Apenas o dono do servidor pode usar este comando!` });
                        return;
                    }
                } else {
                    if (!message.member?.permissions.has(command.permission)) {
                        message.reply({ content: `${anya} Você não tem permissão para usar este comando!` });
                        return;
                    }
                }
                command.action(message, args); 
            }
        }
    }
}