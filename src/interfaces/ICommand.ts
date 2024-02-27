import { type PermissionResolvable } from 'discord.js';

export interface ICommand {
    name: string;
    action: CommandAction;
    isOwnerGuild: boolean;
    permission: PermissionResolvable[]
    aliases: string[];
}
