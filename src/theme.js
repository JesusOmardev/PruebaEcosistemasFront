import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#092D5E" },      // ajusta a paleta corporativa
    secondary: { main: "#ffff" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none" } } },
  },
});
