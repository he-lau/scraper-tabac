import { Routes, Route } from "react-router-dom";
import ListingsPage from "../pages/ListingsPage";
import StatsPage from "../pages/StatsPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

export default function AppRoutes(props) {
  return (
    <Routes>
      <Route path="/login"    element={<LoginPage onLogin={props.onLogin} />} />
      <Route path="/register" element={<RegisterPage onLogin={props.onLogin} />} />
      <Route path="/stats"    element={<StatsPage listings={props.listings} loading={props.loading} />} />
      <Route path="*"         element={<ListingsPage {...props} />} />
    </Routes>
  );
}
