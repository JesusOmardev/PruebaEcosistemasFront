import { useState } from "react";
import { Stack, TextField, Button, Paper } from "@mui/material";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    onAdd({ title: t, description: description.trim() || undefined });
    setTitle(""); setDescription("");
  };

  return (
    <Paper component="form" onSubmit={submit} sx={{ p: 2, mb: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <TextField label="Nueva tarea" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
        <TextField label="Descripción (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
        <Button type="submit" variant="contained">Añadir</Button>
      </Stack>
    </Paper>
  );
}
