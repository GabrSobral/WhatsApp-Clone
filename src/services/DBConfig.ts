import Dexie, { Table } from "dexie";

export type IContactsSchema = {
  id?: number;
  jid: string;
  display_name: string;
  bio?: string;
  is_whatsapp_user?: boolean;
  status?: boolean;
  number?: string;
  unseen_msg_count?: number;
  wa_name?: string,
  photo?: string;
}

export type IMessageSchema = {
  _id?: number;
  key_remote_jid: string;
  key_id: string;
  key_from_me: "incoming" | "outgoing";
  status: "received" | "waiting" | "";
  timestamp: Date;
  received_timestamp?: Date;
  receipt_server_timestamp?: Date;
  receipt_device_timestamp?: Date;
  send_timestamp: Date;
  needs_push: boolean
  recipient_count?: number;
  remote_resource?: string;
  media_wa_type: "text" | "image" | "audio" | "video" | "geo-position";
  latitude: number;
  longitude: number;
  data?: string;
  raw_data?: string;
}

export type IChatListSchema = {
  _id?: string;
  key_remote_jid: IMessageSchema["key_remote_jid"];
  message_table_id: IMessageSchema["_id"]
}

export type IMeSchema = {
  number: string
  jid: string
  wa_name: string
  bio?: string
  photo?: string
}

export class DBClass extends Dexie {
  contacts!: Table<IContactsSchema>;
  messages!: Table<IMessageSchema>;
  chatList!: Table<IChatListSchema>;
  me!:       Table<IMeSchema>;

  constructor() {
    super("WhatsAppClone");
    this.version(1).stores({
      contacts: `
        ++id, 
        display_name, 
        jid,
        bio, 
        is_whatsapp_user, 
        status,number, 
        unseen_msg_count, 
        wa_name, 
        photo`,
        
      messages: `
        ++_id,
        key_remote_jid,
        key_id,
        key_from_me,
        status,
        timestamp,
        received_timestamp,
        receipt_server_timestamp,
        receipt_device_timestamp,
        send_timestamp,
        needs_push,
        recipient_count,
        remote_resource,
        media_wa_type,
        latitude,
        longitude,
        data,
        raw_data`,

      chatList: `
        ++_id,
        key_remote_jid,
        message_table_id`,
      
      me: `
        number,
        jid,
        wa_name,
        bio,
        photo`
      });
  }
}

export const db = new DBClass();