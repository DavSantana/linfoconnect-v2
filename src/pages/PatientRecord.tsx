import { useState, useEffect } from "react";
import { ChevronLeft, FileText, Calendar, User, FileDown, Trash2, Play, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

export default function PatientRecord() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [activeTab, setActiveTab] = useState("captures"); 
  const [patientData, setPatientData] = useState<any>(null);
  const [captures, setCaptures] = useState<any[]>([]); // <-- Bóveda local para las fotos
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // 1. Traer datos del paciente
    const fetchPatient = async () => {
      try {
        const docRef = doc(db, "pacientes_v2", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPatientData({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No se encontró el paciente");
        }
      } catch (error) {
        console.error("Error al obtener el paciente:", error);
      } finally {
        setLoading(false);
      }
    };

    // 2. Escuchar las capturas de la V2 en tiempo real para este paciente específico
    const q = query(
      collection(db, "capturas_v2"),
      where("paciente_id", "==", id),
      orderBy("createdAt", "desc")
    );

    const unsubscribeCaptures = onSnapshot(q, (snapshot) => {
      const realCaptures = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCaptures(realCaptures);
    }, (error) => {
      console.error("Error escuchando capturas de Firestore:", error);
    });

    fetchPatient();

    // Apagamos los radares al salir
    return () => unsubscribeCaptures();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Buscando expediente clínico...</p>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <FileText className="size-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Expediente no encontrado</h2>
        <button onClick={() => navigate("/")} className="mt-6 px-6 py-2 bg-sky-500 text-white rounded-full font-medium hover:bg-sky-600">Volver al inicio</button>
      </div>
    );
  }

  const birthYear = patientData.dateOfBirth ? new Date(patientData.dateOfBirth).getFullYear() : 0;
  const currentYear = new Date().getFullYear();
  const age = birthYear ? currentYear - birthYear : "--";

  return (
    <div className="min-h-screen bg-white relative">
      <div className="mx-auto max-w-4xl px-6 py-8">
        
        {/* Header Section */}
        <header className="mb-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6 -ml-2 px-3 py-2 text-sky-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors font-medium"
          >
            <ChevronLeft className="size-5" />
            <span>Volver al inicio</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {patientData.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-sm">
                <span className="flex items-center gap-1.5">
                  <User className="size-4" />
                  {patientData.nationalId}
                </span>
                <span className="text-slate-300">•</span>
                <span>{age} años</span>
                <span className="text-slate-300">•</span>
                <span>Tel: {patientData.phoneNumber}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/exploracion/${id}`)}
              className="flex items-center justify-center gap-2 h-12 px-6 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-2xl shadow-lg shadow-sky-500/20 transition-all duration-200 active:scale-98 text-sm shrink-0"
            >
              <Play className="size-4 fill-white" />
              <span>Iniciar Estudio</span>
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="space-y-8">
          <div className="flex w-full h-12 p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setActiveTab("captures")}
              className={`flex-1 h-full flex items-center justify-center rounded-xl font-medium transition-all ${
                activeTab === "captures" 
                ? "bg-white text-sky-500 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Calendar className="size-4 mr-2" />
              Historial y Capturas
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex-1 h-full flex items-center justify-center rounded-xl font-medium transition-all ${
                activeTab === "reports" 
                ? "bg-white text-sky-500 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <FileText className="size-4 mr-2" />
              Informes y PDF
            </button>
          </div>

          {/* Tab 1: Captures Content (¡CONECTADO A FIREBASE!) */}
          {activeTab === "captures" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">
                  Escáneres recientes
                </h2>
                <span className="text-sm text-slate-400">
                  {captures.length} {captures.length === 1 ? 'captura' : 'capturas'} encontrada(s)
                </span>
              </div>

              {captures.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
                  <FileText className="size-12 mb-3 text-slate-300" />
                  <p>No hay capturas del Linfofluoroscopio aún para este paciente.</p>
                </div>
              ) : (
                /* Galería Médica */
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {captures.map((capture) => (
                    <div 
                      key={capture.id}
                      onClick={() => setSelectedImage(capture.url)}
                      className="group aspect-square bg-slate-900 border border-slate-200 rounded-2xl overflow-hidden relative cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <img 
                        src={capture.url} 
                        alt="Escáner linfático" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <div className="bg-white/90 p-2 rounded-full text-slate-900 shadow-md">
                          <Eye className="size-5" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-[10px] text-white/90 font-medium">
                          {new Date(capture.createdAt).toLocaleDateString()} - {new Date(capture.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Reports Content */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-semibold text-slate-800">
                Notas clínicas
              </h2>
              <div className="border border-slate-200 bg-slate-50 rounded-3xl p-6">
                <textarea
                  className="w-full min-h-[200px] bg-transparent border-0 resize-none text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 text-base leading-relaxed"
                  placeholder="Escriba las notas clínicas del paciente aquí..."
                  defaultValue={`Paciente: ${patientData.fullName}\nID: ${patientData.nationalId}\nCorreo: ${patientData.email}\n\nÚltima actualización: ${new Date().toLocaleDateString()}`}
                />
              </div>
              <div className="flex justify-end">
                <button className="flex items-center bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-2 h-12 rounded-2xl shadow-sm transition-all hover:shadow-md">
                  <FileDown className="size-5 mr-2" />
                  Exportar a PDF
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="mt-24 pt-8 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-slate-500">Zona de peligro</h3>
              <p className="text-sm text-slate-400">
                Esta acción no se puede deshacer.
              </p>
            </div>
            <button className="flex items-center border border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-400 rounded-2xl h-11 px-5 font-medium transition-all">
              <Trash2 className="size-4 mr-2" />
              Eliminar Paciente
            </button>
          </div>
        </div>

      </div>

      {/* Lightbox para ampliar la radiografía */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <img 
            src={selectedImage} 
            alt="Captura ampliada" 
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10"
          />
        </div>
      )}
    </div>
  );
}