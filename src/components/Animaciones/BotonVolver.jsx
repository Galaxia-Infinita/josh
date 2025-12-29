import { useNavigate, useLocation } from "react-router-dom";

export default function BotonVolver() {
    // 1. Hook para cambiar la ruta (al hacer clic)
    const navigate = useNavigate();
    // 2. Hook para obtener la ruta actual (para saber si mostrar el botón)
    const location = useLocation(); 

    // Oculta el botón si la ruta actual es la raíz ('/')
    if (location.pathname === '/') {
        return null;
    }

    return (
        // Usamos la clase CSS definida previamente para el posicionamiento fijo y vertical
        <div 
            className="back-button-container" 
            onClick={() => navigate('/')} // 👈 Navega al inicio (ruta '/')
            role="button" 
            tabIndex={0} // Permite el enfoque con Tab
            onKeyDown={(e) => { // Permite activarlo con Enter o Spacebar
                if (e.key === 'Enter' || e.key === ' ') {
                    navigate('/');
                }
            }}
        >
            <span className="back-text">VOLVER</span>
        </div>
    );
}