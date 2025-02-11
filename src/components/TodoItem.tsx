
import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ id, text, completed, onToggle, onDelete }: TodoItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 rounded-lg border p-4 transition-all duration-300",
        "hover:border-primary/20 hover:shadow-lg",
        completed && "bg-secondary/50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => onToggle(id)}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300",
          completed
            ? "border-primary bg-primary text-primary-foreground"
            : "border-primary/30 hover:border-primary/60"
        )}
      >
        {completed && <Check className="h-4 w-4" />}
      </button>
      
      <span
        className={cn(
          "flex-1 text-lg transition-all duration-300",
          completed && "text-muted-foreground line-through"
        )}
      >
        {text}
      </span>

      <button
        onClick={() => onDelete(id)}
        className={cn(
          "absolute right-4 flex h-8 w-8 items-center justify-center rounded-full text-destructive opacity-0 transition-all duration-300",
          "hover:bg-destructive/10",
          (isHovered || completed) && "opacity-100"
        )}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};
