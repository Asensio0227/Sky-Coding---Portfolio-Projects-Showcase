interface Message {
  _id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

interface MessageThreadProps {
  messages: Message[];
}

export default function MessageThread({ messages }: MessageThreadProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className='spacing max-h-[600px] overflow-y-auto pr-4'>
      {messages.map((message) => (
        <div
          key={message._id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] rounded-lg px-4 py-3 ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <div className='flex items-center gap-2 mb-1'>
              <span className='text-xs font-semibold'>
                {message.role === 'user' ? 'Visitor' : 'AI Assistant'}
              </span>
              <span
                className={`text-xs ${
                  message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}
              >
                {formatTime(message.createdAt)}
              </span>
            </div>
            <p className='text-sm whitespace-pre-wrap'>{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
