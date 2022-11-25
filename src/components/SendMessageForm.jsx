import React, { useState } from 'react'

const SendMessageForm = ({ sendMessage }) => {
  const [message, changeMessage] = useState('')
  const handleChange = (e) => {
    changeMessage(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(message)
    changeMessage('')
  }
  return (
    <form onSubmit={handleSubmit} className='send-message-form'>
      <input
        onChange={handleChange}
        value={message}
        placeholder='Type your message and hit ENTER'
        type='text'
      />
    </form>
  )
}

export default SendMessageForm
