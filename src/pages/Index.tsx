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
interface TodoCount {
  totalCount: number;
  completedCount: number;
}
const Index = () => {
  const [newTodo, setNewTodo] = useState("");
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();

  // Fetch todos
  const {
    data: todos = [],
    isLoading
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("todos").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });

  // Fetch todo counts
  const {
    data: todoCounts
  } = useQuery({
    queryKey: ["todo-counts"],
    queryFn: async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");
      const response = await supabase.functions.invoke<TodoCount>("count-todos", {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (response.error) throw response.error;
      return response.data;
    }
  });

  // Add todo mutation
  const addTodoMutation = useMutation({
    mutationFn: async (text: string) => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      const {
        data,
        error
      } = await supabase.from("todos").insert([{
        text,
        user_id: user.id
      }]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"]
      });
      queryClient.invalidateQueries({
        queryKey: ["todo-counts"]
      });
      toast({
        title: "Task added",
        description: "Your new task has been added successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Toggle todo mutation
  const toggleTodoMutation = useMutation({
    mutationFn: async ({
      id,
      completed
    }: {
      id: string;
      completed: boolean;
    }) => {
      const {
        error
      } = await supabase.from("todos").update({
        completed
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"]
      });
      queryClient.invalidateQueries({
        queryKey: ["todo-counts"]
      });
    }
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      const {
        error
      } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"]
      });
      queryClient.invalidateQueries({
        queryKey: ["todo-counts"]
      });
      toast({
        title: "Task deleted",
        description: "The task has been removed from your list.",
        variant: "destructive"
      });
    }
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
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-white/50 backdrop-blur-sm p-6 shadow-lg">
          <div className="text-left">
            <h1 className="mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              Tasks
            </h1>
            {todoCounts ? <div className="space-y-1">
                <p className="text-lg font-medium text-indigo-600">
                  Total tasks: {todoCounts.totalCount}
                </p>
                <p className="text-indigo-500 text-sm">
                  {todoCounts.completedCount} completed, {todoCounts.totalCount - todoCounts.completedCount} remaining
                </p>
              </div> : <p className="text-lg text-indigo-500">Loading counts...</p>}
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg border border-indigo-100 bg-white/50 px-4 py-2 text-sm text-indigo-600 transition-all hover:bg-indigo-50 hover:shadow-md">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input type="text" value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder="Add a new task..." className="flex-1 rounded-lg border border-indigo-100 bg-white/50 px-4 py-3 text-lg transition-all duration-300 placeholder:text-indigo-300 hover:border-indigo-200 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
            <button type="submit" disabled={!newTodo.trim() || addTodoMutation.isPending} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50">
              <Plus className="h-5 w-5" />
              Add
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {isLoading ? <p className="text-center text-indigo-500">Loading tasks...</p> : todos.length === 0 ? <EmptyState /> : todos.map(todo => <TodoItem key={todo.id} {...todo} onToggle={id => toggleTodoMutation.mutate({
          id,
          completed: !todos.find(t => t.id === id)?.completed
        })} onDelete={id => deleteTodoMutation.mutate(id)} />)}
        </div>
      </div>
    </div>;
};
export default Index;