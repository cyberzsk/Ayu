import { type PermissionResolvable } from 'discord.js';
import { type ICommandAction } from './ICommandAction';

export interface ICommand {
    name: string;
    action: ICommandAction;
    isOwnerGuild: boolean;
    permission: PermissionResolvable[]
    aliases: string[];
}
