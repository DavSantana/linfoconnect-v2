import { Clock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  time: string;
}

const mockAppointments: Appointment[] = [
  { id: "1", patientName: "Maria García", patientId: "PAT-2024-001", time: "9:00 AM" },
  { id: "2", patientName: "Carlos Rodríguez", patientId: "PAT-2024-015", time: "9:30 AM" },
  { id: "3", patientName: "Ana Martínez", patientId: "PAT-2024-023", time: "10:00 AM" },
  { id: "4", patientName: "José López", patientId: "PAT-2024-044", time: "10:30 AM" },
];

export default function AppointmentsCard() {
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50">
          <Clock className="h-5 w-5 text-sky-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Citas de Hoy</h2>
          <p className="text-sm text-slate-500">{mockAppointments.length} pacientes en cola</p>
        </div>
      </div>

      {/* Patient List */}
      <div className="space-y-3">
        {mockAppointments.map((appointment, index) => (
          <div
            key={appointment.id}
            className="group flex items-center justify-between rounded-2xl bg-slate-50/50 p-4 transition-all hover:bg-slate-50"
          >
            <div className="flex items-center gap-4">
              {/* Queue Number */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-600">
                {index + 1}
              </div>
              
              {/* Patient Info */}
              <div>
                <p className="font-medium text-slate-900">{appointment.patientName}</p>
                <p className="text-sm text-slate-500">{appointment.patientId} • {appointment.time}</p>
              </div>
            </div>

            {/* Start Study Button - Ahora conectado al enrutador */}
            <button 
              onClick={() => navigate('/exploracion')}
              className="flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-sky-600 hover:shadow-md active:scale-[0.98]"
            >
              <Play className="h-4 w-4" fill="currentColor" />
              Iniciar Estudio
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {mockAppointments.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-slate-500">No hay citas programadas para hoy</p>
        </div>
      )}
    </div>
  );
}