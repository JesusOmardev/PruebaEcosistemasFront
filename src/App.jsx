import { useEffect, useState } from "react";
import { Container, Typography, Tabs, Tab, Box, Snackbar, Alert, CircularProgress, Button, Stack, Slide } from "@mui/material";
import { TaskAPI } from "./api/client";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import EditTaskDialog from "./components/EditTaskDialog";

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // para deshabilitar el botón mientras se envía
  const [creating, setCreating] = useState(false);

  // filtro por Tabs: todas,  pendientes y completadas
  const [tab, setTab] = useState(0);
  const filter = tab === 0 ? null : tab === 1 ? false : true;

  // paginación
  const [skip, setSkip] = useState(0);
  const [limit] = useState(5);
  const [hasMore, setHasMore] = useState(true);

  // edición
  const [editing, setEditing] = useState(null);     // {id, title, description} | null
  const [savingEdit, setSavingEdit] = useState(false); // <— este es el que falta


  function openEdit(task) {
    setEditing(task);
  }

  function closeEdit() {
    setEditing(null);
  }

  //Notifiaciones:
  const [success, setSuccess] = useState(null);
  const showSuccess = (msg) => setSuccess(msg);
  const [pendingToast, setPendingToast] = useState(null); // cola para mostrar tras cerrar el modal
  const closeSuccess = () => setSuccess(null);

  function handleToastClose(_, reason) {
    if (reason === "clickaway") return;
    setToast((t) => ({ ...t, open: false }));
  }



  function SlideLeft(props) {               // animación
    return <Slide {...props} direction="left" />;
  }

  const [danger, setDanger] = useState(null);
  const showDanger = (msg) => setDanger(msg);
  const closeDanger = () => setDanger(null);

  async function load(reset = false) {
    try {
      setLoading(true); setError(null);
      const params = { skip: reset ? 0 : skip, limit, ...(filter !== null ? { completed: filter } : {}) };
      const data = await TaskAPI.list(params);
      setItems(prev => reset ? data : [...prev, ...data]);
      setHasMore(data.length === limit);
      setSkip(prev => reset ? limit : prev + limit);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(true); }, [tab]); // recarga al cambiar filtro

  useEffect(() => {
    if (editing === null && pendingToast) {
      showSuccess(pendingToast);
      setPendingToast(null);
    }
  }, [editing, pendingToast]);


  async function addTask(data) {
    try {
      setCreating(true);
      const created = await TaskAPI.create(data);   // POST /tasks
      setItems((prev) => [created, ...prev]);       // prepend
      showSuccess("Tarea creada");                  // 👈 toast verde
      return created;                               // para que el form sepa que fue OK
    } catch (e) {
      setError(e.message);                          // tu toast rojo
      throw e;
    } finally {
      setCreating(false);
    }
  }

  async function toggleTask(id, completed) {
    try {
      setItems((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t))); // optimistic
      await TaskAPI.toggle(id, completed);
    } catch (e) { setError(e.message); load(true); }
  }

  async function deleteTask(id) {
    try {
      await TaskAPI.remove(id);
      setItems(prev => prev.filter(t => t.id !== id));
      showDanger("Tarea eliminada");
    } catch (e) {
      setError(e.message);
    }
  }

  async function saveEdit(data) {
    try {
      setSavingEdit(true);
      const updated = await TaskAPI.patch(editing.id, data);
      setItems(prev => prev.map(t => t.id === editing.id ? { ...t, ...updated } : t));
      setEditing(null);
      setPendingToast("Cambio realizado");
      setEditing(null);// cierra el modal
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingEdit(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>To-Do List</Typography>

      <TaskForm onAdd={addTask} creating={creating} />

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setSkip(0); setHasMore(true); }}>
          <Tab label="Todas" />
          <Tab label="Pendientes" />
          <Tab label="Completadas" />
        </Tabs>
      </Box>

      {loading && items.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress /></Box>
      ) : (
        <>
          <TaskList
            items={items}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={openEdit}
          />
          <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
            <Button disabled={!hasMore || loading} onClick={() => load(false)}>Cargar más</Button>
          </Stack>
        </>
      )}
      {/* Guardar */}
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        <Alert onClose={() => setSuccess(null)} severity="success" variant="filled" sx={{ width: "100%" }}>
          {success}
        </Alert>
      </Snackbar>

      {/* Eliminar */}
      <Snackbar
        open={!!danger}
        autoHideDuration={4500}
        onClose={(_, r) => { if (r !== "clickaway") closeDanger(); }}
        TransitionComponent={SlideLeft}                       
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={closeDanger} severity="error" variant="filled" sx={{ width: "100%" }}>
          {danger}
        </Alert>
      </Snackbar>



      <EditTaskDialog
        open={!!editing}
        initial={editing}
        onClose={closeEdit}
        onSave={saveEdit}
        loading={savingEdit}
      />
    </Container>
  );
}
