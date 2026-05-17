'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, ArrowLeft, Radio, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom'; // <-- Añadimos los ganchos del enrutador

export default function ExplorationRoom() {
  const { id } = useParams(); // Atrapamos el ID de Michael Jordan
  const navigate = useNavigate(); // Herramienta para volver atrás
  
  const [laser780Active, setLaser780Active] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  // CONEXIÓN DE RED 1: Recibir video de la Raspberry Pi
  useEffect(() => {
    const startWebRTC = async () => {
      try {
        const pc = new RTCPeerConnection();
        pcRef.current = pc;
        pc.addTransceiver('video', { direction: 'recvonly' });
        
        pc.ontrack = (event) => {
          if (videoRef.current && event.streams[0]) {
            videoRef.current.srcObject = event.streams[0];
          }
        };
        
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        
        const response = await fetch('http://100.82.151.79:8889/camara/whep', {
          method: 'POST',
          headers: { 'Content-Type': 'application/sdp' },
          body: offer.sdp,
        });
        
        const answerSdp = await response.text();
        await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
      } catch (error) {
        console.error('Error WebRTC:', error);
      }
    };
    
    startWebRTC();
    return () => { pcRef.current?.close(); };
  }, []);

  // CONEXIÓN DE RED 2: Capturar y enviar foto al VPS con ID del paciente
  const handleCaptureImage = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // 1. Congelar el fotograma
      ctx.drawImage(videoRef.current, 0, 0);
      const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      // 2. Mostrar en la interfaz inmediatamente
      setCapturedImages(prev => [imageUrl, ...prev]);

      // 3. Enviar al VPS por Tailscale INCLUYENDO EL ID DEL PACIENTE
      try {
        const response = await fetch('http://100.110.8.70:8001/api/capturas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            imagen_base64: imageUrl,
            paciente_id: id // <-- ¡AQUÍ ESTÁ LA MAGIA! FastAPI sabrá quién es.
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('¡Éxito! El VPS dice:', data.message);
        } else {
          console.error('El servidor rechazó la imagen:', response.statusText);
        }
      } catch (error) {
        console.error('Error de red al intentar contactar al VPS:', error);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 relative">
      {/* Barra de Estado Superior */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800">
        <button 
          onClick={() => navigate(`/paciente/${id}`)} // <-- Ahora este botón sí vuelve al expediente
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Volver a la Ficha</span>
        </button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-zinc-300">Cámara conectada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-zinc-300">VPN Activa</span>
          </div>
        </div>
      </div>

      {/* Visor de Video Principal */}
      <div className="flex-1 flex items-center justify-center px-6 py-6">
        <div className="w-full h-full bg-black border border-zinc-800 rounded-xl flex items-center justify-center relative overflow-hidden">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain bg-black" />
          <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 bg-zinc-900">
            <Radio className="w-16 h-16 text-zinc-600 mb-4 animate-pulse" />
            <p className="text-xl text-zinc-500 font-medium">Conectando...</p>
          </div>
        </div>
      </div>

      {/* Controles y Botonera */}
      <div className="bg-zinc-900 rounded-2xl p-4 m-4 mt-2 border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setLaser780Active(!laser780Active)} className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${laser780Active ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-lg shadow-cyan-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'}`}>
            Láser 780nm
          </button>

          <button
            onClick={handleCaptureImage}
            className="group flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transform hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 ease-out"
          >
            <Camera className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <span>Capturar Imagen</span>
          </button>

          <button onClick={() => navigate(`/paciente/${id}`)} className="px-4 py-2 rounded-lg font-medium text-sm border border-red-900/50 text-red-400 hover:bg-red-900/20 hover:border-red-700/50 transition-all duration-200">
            Finalizar Sesión
          </button>
        </div>

        {/* Tira de Miniaturas */}
        <div className="border-t border-zinc-800 pt-4">
          <p className="text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wide">Capturas recientes ({capturedImages.length})</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {capturedImages.map((imageUrl, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedImage(imageUrl)} 
                className="flex-shrink-0 w-24 h-24 bg-black border border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-500 transition-all relative group overflow-hidden"
              >
                <img src={imageUrl} className="w-full h-full object-cover" />
                <button onClick={(e) => { e.stopPropagation(); setCapturedImages(capturedImages.filter((_, i) => i !== index)); }} className="absolute top-1 right-1 w-6 h-6 bg-red-600/90 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Vista Ampliada */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6 backdrop-blur-sm transition-all duration-300">
          <div className="relative max-w-5xl w-full flex flex-col items-center">
            <button 
              onClick={() => setSelectedImage(null)} 
              className="absolute -top-14 right-0 flex items-center gap-2 text-zinc-400 hover:text-white bg-zinc-800/50 px-5 py-2 rounded-full hover:bg-zinc-700 transition-colors"
            >
              <X className="w-6 h-6" />
              <span className="font-medium">Cerrar</span>
            </button>
            <img src={selectedImage} className="w-full max-h-[80vh] object-contain rounded-xl border border-zinc-800 shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}