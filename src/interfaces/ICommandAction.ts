import { type Message } from "discord.js";

export interface ICommandAction {
  (message: Message, args: string[]): void;
}
