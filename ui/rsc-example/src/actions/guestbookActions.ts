"use server";

type Message = {
  id: string;
  text: string;
};

const messages: Message[] = [];
let nextId = 1;

export async function addMessage(text: string): Promise<Message> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const message = { id: String(nextId++), text };
  messages.unshift(message);
  return message;
}

export async function listMessages(): Promise<Message[]> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  return [...messages];
}
