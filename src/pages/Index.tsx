
import { useState } from "react";
import { TodoItem } from "@/components/TodoItem";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/components/ui/use-toast";
import { Plus, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const Index = () => {
  const [newTodo, setNewTodo] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch todos
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Add todo mutation
  const addTodoMutation = useMutation({
    mutationFn: async (text: string) => {
      const { data, error } = await supabase
        .from("todos")
        .insert([{ text }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: "Task added",
        description: "Your new task has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle todo mutation
  const toggleTodoMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from("todos")
        .update({ completed })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: "Task deleted",
        description: "The task has been removed from your list.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    await addTodoMutation.mutateAsync(newTodo.trim());
    setNewTodo("");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const activeTasks = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="text-left">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Tasks</h1>
          <p className="text-lg text-muted-foreground">
            {activeTasks === 0
              ? "All caught up!"
              : `You have ${activeTasks} active ${
                  activeTasks === 1 ? "task" : "tasks"
                }`}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
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
            disabled={!newTodo.trim() || addTodoMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:opacity-50"
          >
            <Plus className="h-5 w-5" />
            Add
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading tasks...</p>
        ) : todos.length === 0 ? (
          <EmptyState />
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              {...todo}
              onToggle={(id) =>
                toggleTodoMutation.mutate({
                  id,
                  completed: !todos.find((t) => t.id === id)?.completed,
                })
              }
              onDelete={(id) => deleteTodoMutation.mutate(id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Index;
