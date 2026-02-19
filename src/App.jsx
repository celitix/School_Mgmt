import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/login/Login";
import Approutes from "@/routes/Approutes/Approutes";
import PageNotFound from "@/NotFound/PageNotFound";
import GlobalToaster from "@/components/toaster/GlobalToaster";
import LoadingBar from "@/utils/LoadingBar";
import PrivateRoute from "./routes/Auth/PrivateRoute";
import PermissionRoute from "@/routes/Auth/PermissionRoute";
const App = () => {
  return (
    <Router>
      {/* Toaster */}
      <GlobalToaster />

      {/* Loading Top Progress Bar */}
      <LoadingBar />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route element={<PermissionRoute />}>
          </Route>
        </Route>

        <Route path="/*" element={<Approutes />} />
        <Route path="*" element={<PageNotFound />} />

      </Routes>
    </Router>
  );
};

export default App;
