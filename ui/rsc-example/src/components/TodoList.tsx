"use client";

/**
 * TodoList - Client Component with Server Actions
 *
 * This component uses server actions for data mutations.
 * The actions are defined in ../actions/todoActions.ts with "use server".
 */

import { useState, useEffect } from "@my-react/react";

import { addTodo, toggleTodo, deleteTodo, getTodos } from "../actions/todoActions";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load initial todos
  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    const result = await getTodos();
    setTodos(result);
  }

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    try {
      const newTodo = await addTodo(inputValue);
      setTodos([...todos, newTodo]);
      setInputValue("");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggle(id: string) {
    const updatedTodo = await toggleTodo(id);
    if (updatedTodo) {
      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
    }
  }

  async function handleDelete(id: string) {
    const success = await deleteTodo(id);
    if (success) {
      setTodos(todos.filter((t) => t.id !== id));
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e: { target: { value: string } }) => setInputValue(e.target.value)}
          placeholder="Add a todo..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add"}
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <input type="checkbox" checked={todo.completed} onChange={() => handleToggle(todo.id)} />
            <span
              style={{
                flex: 1,
                marginLeft: "0.5rem",
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text}
            </span>
            <button
              onClick={() => handleDelete(todo.id)}
              style={{
                background: "#dc3545",
                padding: "0.25rem 0.5rem",
                fontSize: "0.875rem",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p style={{ color: "#666", marginTop: "1rem" }}>No todos yet. Add one above!</p>}
    </div>
  );
}
