'use client'

import React, {useState} from 'react'

const Chatbox = ({
  onSendMessage
} : {
  onSendMessage: (message: string) => void;
}
) => {
  const [message, setMessage] = useState('')
  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault();

    if(message.trim() === '') {
      onSendMessage(message);
      setMessage("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-between w-full p-4 bg-gray-100 rounded-lg shadow-md">
      <input 
      type="text"
      onChange={(e) => setMessage(e.target.value)}
      className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
      placeholder='Type your message...'
      />
      <button className='ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200' type='submit'>
        Send
      </button>
    </form>
  )
}

export default Chatbox