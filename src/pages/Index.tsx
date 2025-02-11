
import { useState } from "react";
import { TodoItem } from "@/components/TodoItem";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
    };

    setTodos((prev) => [todo, ...prev]);
    setNewTodo("");
    toast({
      title: "Task added",
      description: "Your new task has been added successfully.",
    });
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
      variant: "destructive",
    });
  };

  const activeTasks = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Tasks</h1>
        <p className="text-lg text-muted-foreground">
          {activeTasks === 0
            ? "All caught up!"
            : `You have ${activeTasks} active ${
                activeTasks === 1 ? "task" : "tasks"
              }`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 rounded-lg border bg-transparent px-4 py-3 text-lg transition-all duration-300 placeholder:text-muted-foreground/50 hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={!newTodo.trim()}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:opacity-50"
          >
            <Plus className="h-5 w-5" />
            Add
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {todos.length === 0 ? (
          <EmptyState />
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              {...todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Index;
