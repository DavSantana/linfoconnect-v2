import { useState } from "react";
import { Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AppointmentsCard from "../components/AppointmentsCard";
import RecentPatientsCard from "../components/RecentPatientsCard";
import SearchCard from "../components/SearchCard";
import AddPatientModal from "../components/AddPatientModal";

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Buenos Días"
  if (hour < 18) return "Buenas Tardes"
  return "Buenas Noches"
}

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("home");
  const doctorName = "Martínez";
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar activeItem={activeNav} onItemClick={setActiveNav} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-[1600px] px-8 py-10">
          
          {/* Header */}
          <header className="mb-10 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {getGreeting()}, Dr. {doctorName}
              </h1>
              <p className="mt-1 text-slate-500">
                Aquí está su resumen de hoy
              </p>
            </div>

            {/* Botón Añadir Paciente que abre el Modal */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-3xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:bg-sky-600 hover:shadow-xl hover:shadow-sky-500/30 active:scale-[0.98]"
            >
              <Plus className="h-5 w-5" strokeWidth={2.5} />
              Añadir Paciente
            </button>
          </header>

          {/* Dashboard Grid */}
          <div className="space-y-6">
            <SearchCard />
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <AppointmentsCard />
              </div>
              <div className="lg:col-span-2">
                <RecentPatientsCard />
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center">
            <p className="text-xs text-slate-400">
              Linfoconnect V2.0 • Clinical Lymphatic Fluoroscopy System
            </p>
          </footer>
        </div>
      </main>

      {/* Modal Inyectado (Solo es visible cuando isModalOpen es true) */}
      <AddPatientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={(data) => {
          console.log("Datos del paciente a guardar:", data);
          // La futura conexión con Firebase irá aquí
        }}
      />
    </div>
  )
}