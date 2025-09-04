import { ListItem, ListItemIcon, ListItemText, Checkbox, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
    return (
        <ListItem
            secondaryAction={
                <>
                    <IconButton edge="end" aria-label="editar" onClick={() => onEdit(task)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="eliminar" onClick={() => onDelete(task.id)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            }
        >
            <ListItemIcon>
                <Checkbox checked={task.completed} onChange={(e) => onToggle(task.id, e.target.checked)} />
            </ListItemIcon>
            <ListItemText
                primary={task.title}
                secondary={task.description}
                sx={{ textDecoration: task.completed ? "line-through" : "none" }}
            />
        </ListItem>
    );
}
