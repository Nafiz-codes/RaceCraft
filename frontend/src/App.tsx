import { BrowserRouter, Route, Routes } from "react-router-dom"

import DashboardLayout from "@/layouts/DashboardLayout"
import LandingLayout from "@/layouts/LandingLayout"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingLayout />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>
  )
}
