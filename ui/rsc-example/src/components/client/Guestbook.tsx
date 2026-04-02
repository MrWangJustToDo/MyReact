"use client";

import { useEffect, useState } from "@my-react/react";

import { addMessage, listMessages } from "../../actions/guestbookActions";

type Message = {
  id: string;
  text: string;
};

export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    listMessages().then(setMessages);
  }, []);

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (!inputValue.trim()) return;

    const optimistic: Message = { id: `temp-${Date.now()}`, text: inputValue };
    setMessages((prev) => [optimistic, ...prev]);

    setIsLoading(true);
    try {
      const saved = await addMessage(inputValue);
      setMessages((prev) => [saved, ...prev.filter((item) => item.id !== optimistic.id)]);
      setInputValue("");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e: { target: { value: string } }) => setInputValue(e.target.value)}
          placeholder="Leave a message"
          disabled={isLoading}
        />
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
      <ul className="list">
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
    </div>
  );
}
