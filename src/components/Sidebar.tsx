import { Home, User, FileText, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "Inicio", path: "/" },
  { id: "patients", icon: User, label: "Pacientes", path: "/pacientes" },
  { id: "records", icon: FileText, label: "Registros", path: "/registros" },
  { id: "settings", icon: Settings, label: "Configuración", path: "/configuracion" },
];

export default function Sidebar({ activeItem = "home", onItemClick }: SidebarProps) {
  const navigate = useNavigate();

  const handleNavigation = (id: string, path: string) => {
    // 1. Cambia el color del botón visualmente para dar feedback inmediato
    if (onItemClick) {
      onItemClick(id); 
    }
    
    // 2. El Escudo del Desarrollador en acción
    if (path === "/") {
      navigate("/"); // El Camino Feliz hacia el Dashboard
    } else {
      navigate("/proximamente"); // Todo lo demás rebota a la zona de construcción
    }
  };

  return (
    <aside className="flex h-screen w-20 flex-col items-center border-r border-slate-100 bg-white py-8 shadow-sm">
      {/* Logo */}
      <div className="mb-12 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 shadow-md">
        <span className="text-lg font-bold text-white">L</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id, item.path)}
              className={`group flex h-12 w-12 flex-col items-center justify-center rounded-2xl transition-all duration-200 ${
                isActive
                  ? "bg-sky-50 text-sky-500 shadow-sm"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="mt-1 text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}