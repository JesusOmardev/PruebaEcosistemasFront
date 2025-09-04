import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from "@mui/material";

export default function EditTaskDialog({ open, onClose, initial, onSave, loading=false }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
  }, [initial]);

  const disabled = !title.trim() || (
    title.trim() === (initial?.title ?? "") &&
    (description.trim() || "") === (initial?.description || "")
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar tarea</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="Título" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          <TextField label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button
          onClick={() => onSave({ title: title.trim(), description: description.trim() || undefined })}
          variant="contained"
          disabled={disabled || loading}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
