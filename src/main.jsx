import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import App from "./App.jsx";
import { RoleProvider } from "./context/RoleContext.jsx";
import { CustomThemeProvider } from "./context/ThemeContext.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PrimeReactProvider>
      <RoleProvider>
        <CustomThemeProvider>
        <App />
        </CustomThemeProvider>
      </RoleProvider>
    </PrimeReactProvider>
  </StrictMode>
);
