import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { workService, chartService } from '../../services/api'
import { Book, Film, Tv, Image } from 'lucide-react'

const StatsCard = ({value, label, bgColor='bg-myown-primary-400'}) => {
    return(
        <div className={`
                ${bgColor}
                flex flex-col
                justify-center
                items-center
                text-center
                rounded-2xl 
                p-6
                text-white
                min-w-[150px]
                min-h-[100px]
                shadow-md
            `}>
            <span className="font-bold text-2xl mb-2">{value}</span>
            <p className="text-sm">{label}</p>
        </div>
    )
}

const WorkItem = ({ work, onClick }) => {
    const getCategoryIcon = (category) => {
        const icons = {
            'livro': <Book size={20} className="text-white" />,
            'filme': <Film size={20} className="text-white" />,
            'série': <Tv size={20} className="text-white" />,
        };
        return icons[category] || <Image size={20} className="text-white" />;
    };

    return (
        <div 
            onClick={onClick}
            className="flex flex-col gap-2 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition group min-w-[140px] max-w-[140px]"
        >
            {work.imageCover ? (
                <img 
                    src={work.imageCover} 
                    alt={work.title}
                    className="w-full h-32 rounded-lg object-cover"
                />
            ) : (
                <div className="w-full h-32 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    {getCategoryIcon(work.category)}
                </div>
            )}
            <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-800 truncate group-hover:text-myown-primary-600">
                    {work.title}
                </p>
                <p className="text-xs text-gray-500 capitalize">{work.category}</p>
            </div>
        </div>
    );
};

const ChartItem = ({ chart, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="flex flex-col gap-2 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition group min-w-[140px] max-w-[140px]"
        >
            <div className="w-full h-32 rounded-lg bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                <div className="text-white text-2xl font-bold">
                    {chart.stats?.totalNodes || 0}
                </div>
            </div>
            <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-800 truncate group-hover:text-myown-primary-600">
                    {chart.title}
                </p>
                <p className="text-xs text-gray-500">
                    {chart.works?.length || 0} {chart.works?.length === 1 ? 'obra' : 'obras'}
                </p>
            </div>
        </div>
    );
};

const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalWorks: 0,
        totalCharacters: 0,
        totalCharts: 0
    });
    const [recentWorks, setRecentWorks] = useState([]);
    const [recentCharts, setRecentCharts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (token) {
                    // Buscar estatísticas
                    const statsResponse = await workService.getStats();
                    setStats(statsResponse.data.data.stats);

                    // Buscar obras recentes
                    const worksResponse = await workService.getRecent(5);
                    setRecentWorks(worksResponse.data.data.works);

                    // Buscar charts recentes
                    const chartsResponse = await chartService.getRecent(5);
                    setRecentCharts(chartsResponse.data.data.charts);
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-screen">
            {/* Banner */}
            <div className="flex bg-white px-10 py-8 rounded-2xl shadow-md gap-10">
                <div className="flex flex-col gap-6">
                    <h1>É sempre um prazer ter você por aqui!</h1>
                    <p>Dê vida às suas histórias criando conexões entre personagens de livros, filmes e universos imaginários.</p>
                </div>

                <div className="flex gap-4">
                    <StatsCard 
                        value={stats.totalWorks} 
                        label="Obras" 
                        bgColor="bg-myown-primary-400"
                    />
                    <StatsCard 
                        value={stats.totalCharacters} 
                        label="Personagens" 
                        bgColor="bg-myown-secundary-400"
                    />
                    <StatsCard 
                        value={stats.totalCharts} 
                        label="Charts Criados" 
                        bgColor="bg-myown-terciary-400"
                    />
                </div>
            </div>

            {/* ESPAÇAMENTO */}
            <div className="h-4"/>

            {/* BODY */}
            <div className="flex gap-6 mt-4">
                {/* Lado Esquerdo */}
                <div className="flex-1 flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm">
                    {/* Obras Recentes */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-4">
                            <h2>Obras Recentes:</h2>
                            <button 
                                onClick={() => navigate('/works/create')}
                                className="bg-myown-primary-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-myown-primary-600 transition"
                            >
                                Nova Obra
                            </button>
                        </div>
                        <div>
                            {recentWorks.length > 0 ? (
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {recentWorks.map(work => (
                                        <WorkItem 
                                            key={work._id} 
                                            work={work}
                                            onClick={() => navigate(`/works/${work._id}`)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-12">
                                    Suas obras recentes aparecerão aqui.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Charts Recentes */}
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2>Charts Recentes:</h2>
                            <button 
                                onClick={() => navigate('/charts/create')}
                                className="bg-myown-primary-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-myown-primary-600 transition"
                            >
                                Novo Chart
                            </button>
                        </div>
                        <div>
                            {recentCharts.length > 0 ? (
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {recentCharts.map(chart => (
                                        <ChartItem 
                                            key={chart._id} 
                                            chart={chart}
                                            onClick={() => navigate(`/charts/${chart._id}`)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-12">
                                    Seus charts recentes aparecerão aqui
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lado Direito */}
                <div className="w-80 flex flex-col gap-4">
                    {/* Favoritos */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Meus Favoritos:</h2>
                        <div>
                            <p className="text-sm text-gray-500 italic mb-4">
                                Aqui moram as histórias que tocam a seu coração.
                            </p>
                            <div className="space-y-2">
                                <p className="text-gray-400 text-sm">Nenhum favorito ainda</p>
                            </div>
                        </div>
                    </div>

                    {/* Adicionados Recentemente */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h2 className="mb-4">Adicionados Recentemente:</h2>
                        <div className="space-y-3">
                            {recentWorks.slice(0, 3).map((work, index) => (
                                <div 
                                    key={work._id}
                                    onClick={() => navigate(`/works/${work._id}`)}
                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                                >
                                    <div className={`w-2 h-2 rounded-full ${
                                        index === 0 ? 'bg-purple-500' : 
                                        index === 1 ? 'bg-pink-500' : 
                                        'bg-blue-500'
                                    }`} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">{work.title}</p>
                                        <p className="text-xs text-gray-500">{work.category}</p>
                                    </div>
                                </div>
                            ))}
                            {recentWorks.length === 0 && (
                                <p className="text-gray-400 text-sm">Nenhuma obra adicionada ainda</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;