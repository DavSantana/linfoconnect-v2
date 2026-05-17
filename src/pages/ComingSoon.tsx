import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Ícono de módulo en desarrollo */}
        <div className="mx-auto w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center text-sky-500 animate-pulse">
          <ShieldAlert className="size-8" />
        </div>

        {/* Texto informativo */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Módulo en Desarrollo
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Esta característica está siendo optimizada para la versión <span className="font-semibold text-sky-500">Linfoconnect V2.1</span>. Estará disponible en el próximo despliegue clínico.
          </p>
        </div>

        {/* Separador sutil */}
        <div className="h-px bg-slate-100 w-full" />

        {/* Botón de retorno */}
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-2xl transition-colors shadow-sm text-sm"
        >
          <ArrowLeft className="size-4" />
          Volver al Dashboard principal
        </button>
      </div>

      {/* Footer del sistema */}
      <p className="mt-8 text-xs text-slate-400">
        Linfoconnect V2.0 • Sistema de Seguridad y Transmisión Activo
      </p>
    </div>
  );
}