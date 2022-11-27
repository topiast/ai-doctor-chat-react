import React from 'react'

const MessageList = ({ messages }) => {
  return (
    <ul className='message-list'>
      {messages.map((message) => {
        return (
          <li
            key={message.id}
            className={message.sender === 'user' ? 'message-user' : 'message'}
          >
            <div>{message.sender}</div>
            <div>
              <div>{message.text}</div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default MessageList
