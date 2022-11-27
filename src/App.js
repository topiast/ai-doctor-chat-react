import MessageList from './components/MessageList.jsx'
import SendMessageForm from './components/SendMessageForm.jsx'
import { useEffect, useState } from 'react'
const { Configuration, OpenAIApi } = require('openai')

// openai configurations
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)
const session_prompt =
  'A conversation between a virtual doctor and a patient. The patient describes its problem. The doctor asks questions until it can give a diagnosis and treatment instructions for the diagnosis. The doctor can not give a medicine prescription but it can advise booking a doctor\'s appointment to get the medicine prescription if it is needed for the diagnosis. The doctor will give treatment instructions.\n\nDoctor:\n\n"Hello, my name is Dr. Smith. I\'ll be your virtual doctor today. How can I help you?"'
const start_sequence = '\n\nDoctor:'
const restart_sequence = '\n\nPatient:'
// the dialog that is rendered as messages to the ui
const dialog = [
  {
    sender: 'Dr.  Smith',
    text: "Hello, my name is Dr. Smith. I'll be your virtual doctor today. How can I help you?",
    id: 0
  }
]
// This holds the full dialog between user and the doctor. It is used everytime when a new message and its reply are made
let full_string_dialog = session_prompt
// fetches next answer
const ask = async (question, chat_log) => {
  const prompt_text = `${chat_log}${restart_sequence}\n"${question}"${start_sequence}\n`
  const response = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: prompt_text,
    temperature: 0.7,
    max_tokens: 1500,
    top_p: 1,
    frequency_penalty: 0,
    stop: ['"\n']
  })

  return response.data.choices[0].text.toString()
}

function App() {
  const [messages, changeMessages] = useState(dialog)
  const [userMessage, chageUserMessage] = useState(false)
  const sendMessage = (message) => {
    chageUserMessage(true)
    changeMessages(
      messages.concat({
        sender: 'user',
        text: message,
        id: messages.length + 1
      })
    )
  }

  useEffect(() => {
    const getResponse = async () => {
      const message = messages[messages.length - 1].text
      chageUserMessage(false)
      const doctor_reply = await ask(message, full_string_dialog)
      changeMessages(
        messages.concat({
          sender: 'Dr. Smith',
          text: doctor_reply.replace(/"|\n/g, ''),
          id: messages.length + 1
        })
      )

      //update full dialog
      full_string_dialog += `\n\nPatient:\n\n"${message}"\n\nDoctor:\n${doctor_reply}\n`
    }
    if (userMessage) {
      getResponse()
    }
  }, [messages.length])

  return (
    <div className='app'>
      {/* <Title /> */}
      <MessageList messages={messages} />
      <SendMessageForm sendMessage={sendMessage} />
    </div>
  )
}

export default App
