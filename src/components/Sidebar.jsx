import { 
    ArrowRightStartOnRectangleIcon, 
    BookOpenIcon, 
    CursorArrowRaysIcon, 
    HomeIcon, 
    PuzzlePieceIcon, 
    SparklesIcon, 
    UserIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
    {
        icon: <HomeIcon className="size-6"/>,
        label: 'Dashboard',
        path: '',
        requiresAuth: false
    },
    {
        icon: <SparklesIcon className="size-6"/>,
        label: 'Obras',
        path: 'works',
        requiresAuth: false
    },
    {
        icon: <CursorArrowRaysIcon className="size-6"/>,
        label: 'Charts',
        path: 'charts',
        requiresAuth: false
    },
    {
        icon: <BookOpenIcon className="size-6"/>,
        label: 'Minha Biblioteca',
        path: 'library',
        requiresAuth: true // Apenas para usuários autenticados
    },
    {
        icon: <PuzzlePieceIcon className="size-6"/>,
        label: 'Sobre',
        path: 'about',
        requiresAuth: false
    }
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isGuest, logout } = useAuth();
    const [activeItem, setActiveItem] = useState(0);

    // Atualizar item ativo baseado na rota atual
    useEffect(() => {
        const currentPath = location.pathname.split('/')[1];
        const index = menuItems.findIndex(item => item.path === currentPath);
        if (index !== -1) {
            setActiveItem(index);
        }
    }, [location]);

    const handleNavigation = (index, path, requiresAuth) => {
        // Se requer autenticação e usuário é convidado
        if (requiresAuth && isGuest) {
            alert('Esta funcionalidade está disponível apenas para usuários autenticados. Faça login para continuar.');
            return;
        }

        setActiveItem(index);
        navigate(`/${path}`);
    };

    const handleLogout = async () => {
        if (confirm('Tem certeza que deseja sair?')) {
            await logout();
            navigate('/login');
        }
    };

    // Função para pegar as iniciais do nome
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <nav className="flex flex-col bg-white rounded-2xl shadow-md w-60 h-full p-4">
            {/* Header - Informações do Usuário */}
            <div className="flex items-center gap-3 pb-6 mb-6 border-b-2 border-myown-bg-50">
                {user ? (
                    // Usuário autenticado (Google)
                    <>
                        {user.avatar ? (
                            <img 
                                src={user.avatar} 
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-myown-primary-500 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {getInitials(user.name)}
                                </span>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-800 truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user.email}
                            </p>
                        </div>
                    </>
                ) : isGuest ? (
                    // Modo Convidado
                    <>
                        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center">
                            <UserCircleIcon className="size-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-800">
                                Convidado
                            </p>
                            <p className="text-xs text-gray-500">
                                Modo visitante
                            </p>
                        </div>
                    </>
                ) : (
                    // Fallback (caso não tenha info)
                    <>
                        <div className="w-10 h-10 rounded-full bg-myown-primary-500 flex items-center justify-center">
                            <UserIcon className="size-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-800">
                                Usuário
                            </p>
                            <p className="text-xs text-gray-500">
                                Carregando...
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Body - Menu de Navegação */}
            <ul className="flex flex-col gap-2 flex-1">
                {menuItems.map((item, index) => {
                    const isActive = activeItem === index;
                    const isDisabled = item.requiresAuth && isGuest;

                    return (
                        <li 
                            key={index}
                            onClick={() => handleNavigation(index, item.path, item.requiresAuth)}
                            className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all ${
                                isActive 
                                    ? 'bg-purple-50 text-myown-secundary-500' 
                                    : isDisabled
                                    ? 'text-gray-400 opacity-50 cursor-not-allowed'
                                    : 'text-black hover:bg-gray-50'
                            }`}
                            title={isDisabled ? 'Faça login para acessar' : ''}
                        >
                            <div className={`w-5 h-5 ${isActive ? 'text-myown-secundary-500' : ''}`}>
                                {item.icon}
                            </div>
                            <span className="font-medium text-sm">{item.label}</span>
                            {isDisabled && (
                                <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                    🔒
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>

            {/* Badge de Status (se convidado) */}
            {isGuest && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800 font-medium mb-1">
                        ⚠️ Modo Convidado
                    </p>
                    <p className="text-xs text-yellow-700">
                        Algumas funcionalidades estão restritas
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-2 text-xs text-yellow-900 font-semibold hover:underline"
                    >
                        Fazer login →
                    </button>
                </div>
            )}

            {/* Footer - Botão Sair */}
            {!isGuest && (
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-3 pt-6 mt-6 border-t-2 border-myown-bg-50 hover:bg-red-50 rounded-lg transition-all group"
                >
                    <ArrowRightStartOnRectangleIcon className="size-6 text-gray-700 group-hover:text-red-600" />
                    <span className="font-medium text-sm text-gray-700 group-hover:text-red-600">
                        Sair
                    </span>
                </button>
            )}
        </nav>
    );
}