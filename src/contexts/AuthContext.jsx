import { createContext, useContext, useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { authService } from '../services/authServices';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const storedGuest = localStorage.getItem('isGuest');

      if (token && storedUser) {
        try {
          const response = await authService.verifySession();
          if (response.data.success) {
            setUser(response.data.user);
            setIsGuest(false);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Erro ao verificar sessão:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else if (storedGuest === 'true') {
        setIsGuest(true);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const loginWithGoogle = async (credentialResponse) => {
    try {
      const response = await authService.googleLogin(credentialResponse.credential);

      if (response.data.success) {
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.removeItem('isGuest');
        
        setUser(user);
        setIsGuest(false);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: error.response?.data?.error || 'Erro no login' };
    }
  };

  const loginAsGuest = () => {
    setIsGuest(true);
    setUser(null);
    localStorage.setItem('isGuest', 'true');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const logout = async () => {
    try {
      if (user) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setUser(null);
      setIsGuest(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isGuest');
    }
  };

  const isAuthenticated = () => !!user || isGuest;
  const canSave = () => !!user;
  const canFavorite = () => !!user;
  const canCreateWork = () => !!user;
  
  // 🔧 CORRIGIDO: Verificação correta do creator
  const canEditWork = (work) => {
    if (!user) {
      console.log("❌ Sem usuário logado");
      return false;
    }
    
    if (!work) {
      console.log("❌ Obra não fornecida");
      return false;
    }

    // Se work.creator for um objeto populado
    const creatorId = work.creator?._id || work.creator;
    
    if (!creatorId) {
      console.log("❌ Obra sem creator");
      return false;
    }

    const canEdit = String(creatorId) === String(user.id);
    
    console.log("✅ User ID:", user.id);
    console.log("✅ Creator ID:", creatorId);
    console.log("✅ Pode editar?", canEdit);
    
    return canEdit;
  };

  const value = {
    user,
    isGuest,
    loading,
    loginWithGoogle,
    loginAsGuest,
    logout,
    isAuthenticated,
    canSave,
    canFavorite,
    canCreateWork,
    canEditWork
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};