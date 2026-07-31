"use client";

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
    <div className="widget">
      <p className="widget-label">Todos</p>
      <form className="inline-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e: { target: { value: string } }) => setInputValue(e.target.value)}
          placeholder="Add a todo"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "…" : "Add"}
        </button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "is-done" : undefined}>
            <label>
              <input type="checkbox" checked={todo.completed} onChange={() => handleToggle(todo.id)} />
              <span>{todo.text}</span>
            </label>
            <button type="button" className="btn-danger" onClick={() => handleDelete(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p className="muted">No todos yet.</p>}
    </div>
  );
}
