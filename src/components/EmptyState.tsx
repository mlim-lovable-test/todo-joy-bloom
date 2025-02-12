
import { ListTodo } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-indigo-200 bg-white/50 p-8 text-center backdrop-blur-sm">
      <div className="rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
        <ListTodo className="h-8 w-8 text-indigo-500" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-indigo-700">No tasks yet</h3>
        <p className="text-sm text-indigo-500">Add your first task to get started</p>
      </div>
    </div>
  );
};
