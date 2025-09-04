import { useState } from "react";
import { Stack, TextField, Button, Paper } from "@mui/material";

export default function TaskForm({ onAdd, creating = false }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    try {
      await onAdd({ title: t, description: description.trim() || undefined });
      // si fue bien, limpia
      setTitle("");
      setDescription("");
    } catch (_) {
      // el App.jsx ya muestra el toast rojo
    }
  };

  return (
    <Paper component="form" onSubmit={submit} sx={{ p: 2, mb: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <TextField label="Nueva tarea" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
        <TextField label="Descripción (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
        <Button type="submit" variant="contained" disabled={creating || !title.trim()}>
          Añadir
        </Button>
      </Stack>
    </Paper>
  );
}
