import { IndexedDBProps } from "react-indexed-db";

export const DBConfig: IndexedDBProps = {
  name: 'WhatsAppClone',
  version: 1,
  objectStoresMeta: [
    {
      store: 'contacts',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'jid', keypath: 'jid', options: { unique: true }}, // e.g: x@whatsapp.clone
        { name: 'is_whatsapp_user', keypath:'is_whatsapp_user', options: { unique: false }},
        { name: 'status', keypath: 'status', options: { unique: false }},
        { name: 'number', keypath: 'number', options: { unique: true }},
        { name: 'unseen_msg_count', keypath:'unseen_msg_count', options: { unique: false }},
        { name: 'display_name', keypath:'display_name', options: { unique: false }},
        { name: 'wa_name', keypath:'display_name', options: { unique: false }},
        { name: 'photo', keypath:'display_name', options: { unique: false }},
      ]
    },

    {
      store: 'messages',
      storeConfig: { keyPath: '_id', autoIncrement: true },
      storeSchema: [
        { name: 'key_remote_jid', keypath: 'key_remote_jid', options: { unique: false }},
        { name: 'key_id', keypath: 'key_id', options: { unique: true }},
        { name: 'key_from_me', keypath: 'key_from_me', options: { unique: false }},
        { name: 'status', keypath: 'status', options: { unique: false }},
        { name: 'timestamp', keypath: 'timestamp', options: { unique: false }},
        { name: 'received_timestamp',keypath:'received_timestamp',options:{ unique: false }},
        { name: 'receipt_server_timestamp',keypath:'receipt_server_timestamp', options:{ unique: false }},
        { name: 'receipt_device_timestamp ',keypath:'receipt_device_timestamp', options:{ unique: false }},
        { name: 'need_push',keypath:'need_push',options:{ unique: false }},
        { name: 'recipient_count', keypath:'recipient_count', options:{ unique: false }},
        { name: 'remote_resource', keypath:'remote_resource', options:{ unique: false }},
        { name: 'media_wa_type', keypath:'media_wa_type', options:{ unique: false }},
        { name: 'data', keypath:'data', options:{ unique: false }},
        { name: 'raw_data', keypath:'raw_data', options:{ unique: false }},
      ]
    },

    {
      store: 'chat_list',
      storeConfig: { keyPath: '_id', autoIncrement: true },
      storeSchema: [
        { name: 'key_remote_jid', keypath: 'key_remote_jid', options: { unique: false }},
        { name: 'message_table_id', keypath: 'message_table_id', options: { unique: false }},
      ]
    }
  ]
}