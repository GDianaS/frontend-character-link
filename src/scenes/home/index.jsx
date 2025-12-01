import React from 'react'
import { useNavigate } from 'react-router-dom'

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

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="flex-1 p-8 min-h-screen">
            {/* Banner */}
            <div className="flex bg-white px-10 py-8 rounded-2xl shadow-md gap-10">
                <div className="flex flex-col gap-6">
                    <h1>É sempre um prazer ter você por aqui!</h1>
                    <p>Dê vida às suas histórias criando conexões entre personagens de livros, filmes e universos imaginários.</p>
                </div>

                <div className="flex gap-4">
                    <StatsCard 
                        value="200 +" 
                        label="Obras" 
                        bgColor="bg-myown-primary-400"
                    />
                    <StatsCard 
                        value="400 +" 
                        label="Personagens" 
                        bgColor="bg-myown-secundary-400"
                    />
                    <StatsCard 
                        value="500 +" 
                        label="Charts Criados" 
                        bgColor="bg-myown-terciary-400"
                    />
                </div>
            </div>

            {/* ESPAÇAMENTO */}
            <div className="h-4"/>

            {/* BODY */}
            <div className="flex gap-6 mt-8">
                {/* Lado Esquerdo */}
                <div className="flex-1 flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm">
                    {/* Obras Recentes */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-4">
                            <h2>Obras Recentes:</h2>
                            <button 
                            onClick={() => navigate('/works/create')}
                            className="bg-myown-primary-500 text-white font-semibold px-6 py-2 rounded-lg">
                                Nova Obra
                            </button>
                        </div>
                        <div>
                            <p className="text-gray-500 text-center py-12">Suas obras recentes aparecerão aqui.</p>
                        </div>
                    </div>

                    {/* Charts Recentes */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2>Charts Recentes:</h2>
                            <button 
                               onClick={() => navigate('/charts/create')}
                                className="bg-myown-primary-500 text-white font-semibold px-6 py-2 rounded-lg"
                            >
                                Novo Chart
                            </button>
                        </div>
                        <div>
                            <p className="text-gray-500 text-center py-12">Seus charts recentes aparecerão aqui</p>
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
                            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">Harry Potter</p>
                                    <p className="text-xs text-gray-500">livro</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">Stranger Things</p>
                                    <p className="text-xs text-gray-500">série</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;