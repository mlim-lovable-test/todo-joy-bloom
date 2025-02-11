
import { ListTodo } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-primary/20 p-8 text-center">
      <div className="rounded-full bg-secondary p-4">
        <ListTodo className="h-8 w-8 text-primary/60" />
      </div>
      <div>
        <h3 className="text-lg font-medium">No tasks yet</h3>
        <p className="text-sm text-muted-foreground">Add your first task to get started</p>
      </div>
    </div>
  );
};
