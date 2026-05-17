import { useEffect, useState } from "react";
import { Users, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";

interface Patient {
  id: string;
  fullName: string;
  nationalId: string;
  createdAt: string;
}

export default function RecentPatientsCard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "pacientes_v2"),
      orderBy("createdAt", "desc"),
      limit(4)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const realPatients = snapshot.docs.map((doc) => ({
        id: doc.id,
        fullName: doc.data().fullName || "Sin Nombre",
        nationalId: doc.data().nationalId || "Sin ID",
        createdAt: doc.data().createdAt,
      }));
      
      setPatients(realPatients);
      setLoading(false);
    }, (error) => {
      console.error("Error escuchando a Firebase:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] h-full">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
          <Users className="h-5 w-5 text-slate-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Mis Pacientes Recientes</h2>
          <p className="text-sm text-slate-500">Base de datos en vivo</p>
        </div>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="flex justify-center p-4 text-sm text-slate-400">Cargando pacientes...</div>
        ) : patients.length === 0 ? (
          <div className="flex justify-center p-4 text-sm text-slate-400">No hay pacientes registrados.</div>
        ) : (
          patients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => navigate(`/paciente/${patient.id}`)} 
              className="group flex w-full items-center justify-between rounded-2xl p-3 text-left transition-all hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-sky-50 text-sm font-semibold text-sky-600">
                  {patient.fullName.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{patient.fullName}</p>
                  <p className="text-sm text-slate-500">ID: {patient.nationalId}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-sky-500" />
            </button>
          ))
        )}
      </div>

      <button 
        onClick={() => navigate('/pacientes')}
        className="mt-4 w-full text-center text-sm font-medium text-sky-500 transition-colors hover:text-sky-600"
      >
        Ver Todos los Pacientes →
      </button>
    </div>
  );
}