import { BrowserRouter, Route, Routes } from "react-router-dom"

import DashboardLayout from "@/layouts/DashboardLayout"
import LandingLayout from "@/layouts/LandingLayout"
import DriversExplorerPage from "@/pages/DriversExplorerPage"
import CircuitsExplorerPage from "@/pages/CircuitsExplorerPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingLayout />} />
        <Route path="/telemetry" element={<LandingLayout />} />
        <Route path="/about" element={<LandingLayout />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/drivers" element={<DriversExplorerPage />} />
        <Route path="/circuits" element={<CircuitsExplorerPage />} />
      </Routes>
    </BrowserRouter>
  )
}
