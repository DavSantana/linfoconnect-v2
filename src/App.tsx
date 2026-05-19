import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ExplorationRoom from "./pages/ExplorationRoom";
import PatientRecord from "./pages/PatientRecord";
import ComingSoon from "./pages/ComingSoon";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute"; // <-- Importamos al Guardia

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas Privadas: El escudo de seguridad entra en acción */}
        
        {/* La ruta principal '/' carga el Dashboard */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/paciente/:id" 
          element={
            <ProtectedRoute>
              <PatientRecord />
            </ProtectedRoute>
          } 
        />
        
        {/* La ruta '/exploracion' carga la cámara médica */}
        <Route 
          path="/exploracion/:id" 
          element={
            <ProtectedRoute>
              <ExplorationRoom />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/proximamente" 
          element={
            <ProtectedRoute>
              <ComingSoon />
            </ProtectedRoute>
          } 
        />

        {/* Ruta de escape: Redirige cualquier dirección inválida o inventada al Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}