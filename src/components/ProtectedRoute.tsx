import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth'; // <-- Le decimos a Vite que esto es un Tipo
import { auth } from '../config/firebase';

// Definimos que este componente va a "envolver" a otros componentes (children)
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged es el radar de Firebase. Escucha en tiempo real si hay una sesión.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Tiene su credencial médica válida
        setUser(currentUser);
        setLoading(false);
      } else {
        // Intruso detectado. Lo mandamos directo a la página de login.
        navigate('/login');
      }
    });

    // Apagamos el radar si el componente se destruye
    return () => unsubscribe();
  }, [navigate]);

  // Mientras Firebase revisa los servidores, mostramos una pantalla de carga clínica
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium tracking-wide">
          Verificando credenciales de seguridad...
        </p>
      </div>
    );
  }

  // Si pasó la verificación, le renderizamos el componente que pidió (El Dashboard o el Expediente)
  return <>{children}</>;
}