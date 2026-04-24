import { Routes, Route } from "react-router-dom";
import ListingsPage from "../pages/ListingsPage";
import StatsPage from "../pages/StatsPage";

export default function AppRoutes(props) {
  return (
    <Routes>
      <Route path="/stats" element={<StatsPage listings={props.listings} loading={props.loading} />} />
      <Route path="*"      element={<ListingsPage {...props} />} />
    </Routes>
  );
}
