import { useState } from "react"
import EmojiSVG from '../../images/emoji.svg'
import FileSVG from '../../images/file.svg'
import AudioSVG from '../../images/audio.svg'
import { ChatHeader } from "./ChatHeader"
import { MessagesContainer } from "./MessagesContainer"

import styles from './styles.module.scss'

export function Chat(){
  const [ newMessage, setNewMessage] = useState('')
  function sendMessage(){}

  return (
    <div className={styles.container}>
      <ChatHeader/>
      <MessagesContainer/>

      <div className={styles.write_message}>
        <form onSubmit={sendMessage}>
          <button type="button">
            <img src={EmojiSVG} alt="Emoji"/>
          </button>
          <button type="button">
            <img src={FileSVG} alt="Anexos"/>
          </button>
          <input 
            value={newMessage} 
            type='text' 
            placeholder='Digite uma mensagem' 
            onChange={
              (event)=> { setNewMessage(event.target.value) }
            }/>
          <button type="button">
            <img src={AudioSVG} alt="Anexos"/>
          </button>
        </form>
      </div>
    </div>
  )
}