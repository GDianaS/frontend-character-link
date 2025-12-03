import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { SparklesIcon, UserIcon } from '@heroicons/react/24/outline';


function Login() {
  const { loginWithGoogle, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await loginWithGoogle(credentialResponse);
    if (result.success) {
      navigate('/');
    } else {
      alert(`Erro no login: ${result.error}`);
    }
  };

  const handleGoogleError = () => {
    alert('Erro ao fazer login com Google. Tente novamente.');
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/');
  };

  return (
    <div className="flex-1 p-8 min-h-screen bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SparklesIcon className="w-12 h-12 text-purple-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Character Link
          </h1>
          <p className="text-gray-600">
            Organize suas obras e personagens favoritos
          </p>
        </div>

        {/* Google Login Button */}
        <div className="mb-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            size="large"
            width="350"
            text="continue_with"
            shape="rectangular"
            theme="outline"
          />
        </div>

        {/* Divisor */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">ou</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Botão Convidado */}
        <button
          onClick={handleGuestLogin}
          className="w-full flex items-center justify-center gap-3 bg-purple-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-600 transition shadow-md"
        >
          <UserIcon className="w-5 h-5" />
          Entrar como Convidado
        </button>

        {/* Informações */}
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
          <h3 className="font-semibold text-sm text-purple-800 mb-2">
            💡 Modo Convidado:
          </h3>
          <ul className="text-xs text-purple-700 space-y-1">
            <li>✓ Acesse obras cadastradas</li>
            <li>✓ Crie mapas temporários</li>
            <li>✓ Faça o download de seu mapa</li>
            <li>✗ Não é possível salvar mapa ou criar obra</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;