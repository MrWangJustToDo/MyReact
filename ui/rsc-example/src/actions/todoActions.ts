"use server";

/**
 * Todo Actions - Server Actions
 *
 * This file uses the "use server" directive to mark all exported functions
 * as server actions. They can be called from client components.
 */

// In-memory todo storage (would be a database in production)
const todos: { id: string; text: string; completed: boolean }[] = [];
let nextId = 1;

/**
 * Add a new todo item
 */
export async function addTodo(text: string) {
  // Simulate database latency
  await new Promise((resolve) => setTimeout(resolve, 200));

  const todo = {
    id: String(nextId++),
    text,
    completed: false,
  };

  todos.push(todo);
  return todo;
}

/**
 * Toggle a todo's completed status
 */
export async function toggleTodo(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    return todo;
  }
  return null;
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const index = todos.findIndex((t) => t.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Get all todos
 */
export async function getTodos() {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return [...todos];
}
