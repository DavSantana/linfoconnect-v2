import { useState, useEffect, useRef } from "react";
import { Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";

interface Patient {
  id: string;
  fullName: string;
  nationalId: string;
}

export default function SearchCard() {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // El radar: Descargamos la lista de pacientes en segundo plano para búsqueda instantánea
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pacientes_v2"), (snapshot) => {
      const allPatients = snapshot.docs.map(doc => ({
        id: doc.id,
        fullName: doc.data().fullName || "",
        nationalId: doc.data().nationalId || ""
      }));
      setPatients(allPatients);
    });
    return () => unsubscribe();
  }, []);

  // Detector de clics: Cierra el menú si el usuario hace clic en otra parte de la pantalla
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Motor de filtrado en memoria (Busca por nombre o por cédula sin distinguir mayúsculas)
  const filteredPatients = patients.filter(p => 
    p.fullName.toLowerCase().includes(query.toLowerCase()) || 
    p.nationalId.includes(query)
  );

  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative z-40" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar pacientes por cédula o nombre..."
          className="h-12 w-full rounded-2xl bg-slate-50 pl-12 pr-4 text-base text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-slate-100 focus:ring-2 focus:ring-sky-500/20"
        />
      </div>

      {/* Menú flotante de resultados estilo Spotlight */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {filteredPatients.length > 0 ? (
            <div className="max-h-64 overflow-y-auto p-2 space-y-1">
              {filteredPatients.map(patient => (
                <button
                  key={patient.id}
                  onClick={() => {
                    setIsOpen(false);     // Cerramos el menú
                    setQuery("");         // Limpiamos la barra
                    navigate(`/paciente/${patient.id}`); // Viajamos al expediente
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                >
                  <div className="bg-sky-50 p-2 rounded-full text-sky-500">
                    <User className="size-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{patient.fullName}</p>
                    <p className="text-xs text-slate-500">Cédula: {patient.nationalId}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-slate-500">
              No se encontró ningún paciente con "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}