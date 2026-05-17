import * as React from "react";
import { X } from "lucide-react";
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: PatientFormData) => void;
}

interface PatientFormData {
  fullName: string;
  nationalId: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
}

export default function AddPatientModal({ isOpen, onClose, onSave }: AddPatientModalProps) {
  const [formData, setFormData] = React.useState<PatientFormData>({
    fullName: "",
    nationalId: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // RADAR DE DEPURACIÓN 1: Verificamos si el botón realmente responde
    console.log("1. ¡Botón presionado! Intentando contactar a la base de datos...");

    try {
      const docRef = await addDoc(collection(db, "pacientes_v2"), {
        fullName: formData.fullName,
        nationalId: formData.nationalId,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        createdAt: new Date().toISOString()
      });
      
      // RADAR DE DEPURACIÓN 2: Verificamos si Firebase aceptó los datos
      console.log("2. ¡Éxito absoluto! Paciente guardado en Firebase con ID:", docRef.id);
      
      if (onSave) {
        onSave(formData);
      }
      onClose(); // Cerramos la ventana si todo salió bien
    } catch (error) {
      // RADAR DE DEPURACIÓN 3: Verificamos si Firebase nos bloqueó
      console.error("2. ERROR CRÍTICO al guardar en Firebase:", error);
      alert("Error de conexión con Firebase. Revisa la consola (F12).");
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-xl mx-4 bg-white rounded-3xl shadow-2xl shadow-black/10 animate-in fade-in-0 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-2">
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Añadir Nuevo Paciente
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-600">Nombre completo</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/30 focus:bg-white transition-all duration-200" placeholder="Ej. Juan Pérez" required />
            </div>

            {/* National ID */}
            <div className="space-y-2">
              <label htmlFor="nationalId" className="block text-sm font-medium text-slate-600">Cédula de Identidad</label>
              <input type="text" id="nationalId" name="nationalId" value={formData.nationalId} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/30 focus:bg-white transition-all duration-200" placeholder="Ej. 12345678" required />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-600">Fecha de nacimiento</label>
              <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/30 focus:bg-white transition-all duration-200" required />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-600">Teléfono</label>
              <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/30 focus:bg-white transition-all duration-200" placeholder="Ej. 0412-1234567" required />
            </div>

            {/* Email */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-600">Correo electrónico</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/30 focus:bg-white transition-all duration-200" placeholder="paciente@ejemplo.com" required />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full text-slate-600 font-medium hover:bg-slate-100 transition-colors duration-200">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-full bg-sky-500 text-white font-medium hover:bg-sky-600 active:bg-sky-700 shadow-lg shadow-sky-500/25 transition-all duration-200">
              Guardar Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}