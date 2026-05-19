import { useState } from 'react';
import { Mail, Lock, Zap, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase'; // Asegúrate de que la ruta sea correcta

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Limpiamos errores previos

    try {
      // Magia de Firebase: Validamos credenciales
      await signInWithEmailAndPassword(auth, email, password);
      
      // Si el código llega aquí, el login fue exitoso. ¡Lo mandamos al Dashboard!
      navigate('/'); 
    } catch (err: any) {
      console.error("Error de autenticación:", err);
      // Mensaje de error genérico y seguro
      setError('Credenciales inválidas. Por favor, verifique su correo y contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 px-12 relative overflow-hidden">
        {/* Decorative subtle elements */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center max-w-md">
          {/* Logo/Branding */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-400 rounded-2xl blur-md opacity-20"></div>
              <div className="relative bg-white rounded-2xl p-4 border border-sky-200">
                <Zap className="w-12 h-12 text-sky-500" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Platform Title */}
          <h1 className="text-5xl font-bold text-slate-900 mb-3 tracking-tight">
            Linfoconnect
          </h1>
          <p className="text-2xl font-semibold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent mb-6">
            V2.0
          </p>

          {/* Tagline */}
          <p className="text-sm text-slate-500 leading-relaxed font-medium tracking-wide">
            Near-Infrared Fluorescence Imaging Core
          </p>

          {/* Decorative Network Visualization */}
          <div className="mt-12 relative h-32 flex items-center justify-center">
            <svg viewBox="0 0 200 120" className="w-full max-w-xs opacity-50" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="60" r="6" fill="#0ea5e9" opacity="0.7" />
              <circle cx="100" cy="30" r="6" fill="#3b82f6" opacity="0.7" />
              <circle cx="150" cy="60" r="6" fill="#0ea5e9" opacity="0.7" />
              <circle cx="100" cy="90" r="6" fill="#3b82f6" opacity="0.7" />
              <line x1="50" y1="60" x2="100" y2="30" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.4" />
              <line x1="100" y1="30" x2="150" y2="60" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />
              <line x1="150" y1="60" x2="100" y2="90" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.4" />
              <line x1="100" y1="90" x2="50" y2="60" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />
            </svg>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-slate-400 mt-8 font-medium">
            Linfoconnect is restricted to authorized medical personnel
          </p>
        </div>
      </div>

      {/* Right Login Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-400 rounded-lg blur-md opacity-20"></div>
              <div className="relative bg-white rounded-lg p-3 border border-sky-200">
                <Zap className="w-8 h-8 text-sky-500" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg shadow-slate-100">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Especialista Login</h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Ingrese sus credenciales para acceder a la plataforma clínica.
            </p>

            {/* Manejador de Errores Visual */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in duration-300">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@ucab.edu.ve"
                    className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl pl-12 pr-4 py-3 border border-slate-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl pl-12 pr-4 py-3 border border-slate-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <a href="#" className="text-xs text-sky-600 hover:text-sky-700 transition-colors font-medium">
                  ¿Olvidó su contraseña?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold py-3 rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all shadow-md shadow-sky-200 hover:shadow-lg hover:shadow-sky-300 disabled:opacity-75 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-8 font-medium">
              Plataforma segura para personal médico autorizado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}