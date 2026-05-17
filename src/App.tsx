import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ExplorationRoom from "./pages/ExplorationRoom";
import PatientRecord from "./pages/PatientRecord";
import ComingSoon from "./pages/ComingSoon";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* La ruta principal '/' carga el Dashboard */}
        <Route path="/" element={<Dashboard />} />

        <Route path="/paciente/:id" element={<PatientRecord />} />
        
        {/* La ruta '/exploracion' carga la cámara médica */}
        <Route path="/exploracion" element={<ExplorationRoom />} />

        <Route path="/proximamente" element={<ComingSoon />} />
        
      </Routes>
    </BrowserRouter>
  );
}