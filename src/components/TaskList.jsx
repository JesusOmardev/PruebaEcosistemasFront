import { List, Paper } from "@mui/material";
import TaskItem from "./TaskItem";

export default function TaskList({ items, onToggle, onDelete, onEdit }) {
  if (!items?.length) return <Paper sx={{ p: 2 }}>No hay tareas todavía.</Paper>;

  return (
    <Paper sx={{ p: 1 }}>
      <List>
        {items.map((t) => (
          <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </List>
    </Paper>
  );
}
