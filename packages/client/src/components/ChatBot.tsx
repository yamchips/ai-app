import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ClipboardEvent,
} from 'react';
import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

type Message = {
  content: string;
  role: 'user' | 'bot';
};

const ChatBot = () => {
  const conversationId = useRef(crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const { register, handleSubmit, reset, formState } = useForm<FormData>();
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onCopyMessage = (e: ClipboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  };

  const onSubmit = async ({ prompt }: FormData) => {
    setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
    setIsBotTyping(true);
    reset();
    const response = await axios.post<ChatResponse>('/api/chat', {
      prompt,
      conversationId: conversationId.current,
    });
    const { data } = response;
    // console.log(response);
    setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
    setIsBotTyping(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 mb-5">
        {messages.map((message, index) => (
          <div
            key={index}
            onCopy={onCopyMessage}
            className={`px-3 py-1 rounded-xl ${
              message.role === 'user'
                ? 'bg-blue-600 text-white self-end'
                : 'bg-gray-100 text-black self-start'
            }`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}
        {isBotTyping && (
          <div className="flex gap-1 px-3 py-3 bg-gray-200 rounded-xl self-start">
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        ref={formRef}
        className="flex flex-col px-3 py-3 gap-2 items-end border-2 div-4 rounded-3xl"
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (data) => data.trim().length > 0,
          })}
          className="w-full border-0 focus:outline-0 resize-none"
          placeholder="Ask anything"
          maxLength={1000}
        />
        <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
