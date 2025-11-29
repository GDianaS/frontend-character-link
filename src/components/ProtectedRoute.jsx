import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// MOSTRA: CAIXA DE MENSAGEM PARA FAZER LOGIN

// Rota que requer autenticação (usuário ou convidado)
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Rota que requer usuário autenticado (não convidado)
export function UserOnlyRoute({ children }) {
  const { user, isGuest } = useAuth();

  if (!user) {
    if (isGuest) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Acesso Restrito
            </h2>
            <p className="text-gray-600 mb-6">
              Esta funcionalidade está disponível apenas para usuários autenticados.
            </p>
              <a href="/login"
              className="inline-block bg-purple-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-600 transition">
              Fazer Login
              </a>
          </div>
        </div>
      );
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}