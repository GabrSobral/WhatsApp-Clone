import { IMessage, IReferencedTo } from "./IMessage";
import { IUser } from "./IUser";

export type IRoom = {
  _id: string;
  messages: IMessage[];
  user: IUser[];
  referencedTo?: IReferencedTo;
  unreadMessages: number;
  isWritting?: boolean;
  currentMessage?: string;
  hasMessages?: boolean;
  hasAllMessages?: boolean;
}