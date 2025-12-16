import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Sorting from "./pages/Sorting";
import ABTesting from "./pages/ABTesting";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sorting" element={<Sorting />} />
          <Route path="/ab-testing" element={<ABTesting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
