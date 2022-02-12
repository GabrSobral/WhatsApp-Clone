import { ChatHeader } from "./ChatHeader"
import { MessagesContainer } from "./MessagesContainer"
import { SendMessageInput } from "./SendMessageInput"

import styles from './styles.module.scss'

export function Chat(){
  return (
    <div className={styles.container}>
      <ChatHeader/>
      <MessagesContainer/>
      <SendMessageInput/>
    </div>
  )
}