import { ArrowLeftIcon, ChevronLeftIcon, HeartIcon, PlusIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workService } from "../../services/api";
import AddCharacter from "../../components/AddCharacter";
import {useAuth} from '../../contexts/AuthContext'

const WorkDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canFavorite, canCreateWork, isGuest } = useAuth();
  
  const [work, setWork] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddCharacter, setShowAddCharacter] = useState(false);

  useEffect(() => {
    if (id) {
      loadWorkDetails();
      loadCharacters();
    }
  }, [id]);

  const loadWorkDetails = async () => {
    try {
      const response = await workService.getById(id);
      setWork(response.data.data.work);
    } catch (error) {
      console.error('Erro ao carregar obra:', error);
      alert('Erro ao carregar detalhes da obra');
    } finally {
      setLoading(false);
    }
  };

  const loadCharacters = async () => {
    try {
      const response = await workService.getCharacters(id);
      setCharacters(response.data.data.characters || []);
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const toggleFavorite = () => {
    if (!canFavorite()) {
      alert('Faça login para favoritar obras!');
      return;
    }
    setIsFavorite(!isFavorite);
    // TODO: Chamar API para adicionar/remover favorito
  };

  const handleCharacterAdded = (newCharacter) => {
    setCharacters([...characters, newCharacter]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Obra não encontrada</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 min-h-screen bg-gray-50">
      {/* Botão Voltar */}
      <button 
        onClick={handleBack}
        className="flex items-center gap-2 mb-6 text-gray-700 hover:text-gray-900 transition"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span className="font-medium">Voltar</span>
      </button>

      {/* Conteúdo Principal */}
      <div className="flex gap-8">
        {/* Lado Esquerdo - Imagem */}
        <div className="w-2/5">
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <img 
              src={work.image || 'https://placehold.co/400x600/e2e8f0/64748b?text=Sem+Imagem'}
              alt={work.title}
              className="w-full h-[500px] object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Lado Direito - Informações */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Título e Autor */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-purple-600 mb-2">
                  {work.title}
                </h1>
                {work.subtitle && (
                  <h2 className="text-xl text-gray-600 mb-2">{work.subtitle}</h2>
                )}
                <p className="text-gray-600">
                  Por: <span className="text-purple-500 font-medium">{work.author}</span>
                </p>
              </div>
              <button
                onClick={toggleFavorite}
                disabled={!canFavorite()}
                className={`p-3 rounded-full transition ${
                  isFavorite 
                    ? 'bg-red-100 text-red-500' 
                    : canFavorite()
                    ? 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
                title={isGuest ? 'Faça login para favoritar' : 'Favoritar'}
              >
                <HeartIcon className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Descrição */}
            {work.description && (
              <div className="text-gray-700 leading-relaxed">
                <p className={`${!showFullDescription ? 'line-clamp-6' : ''}`}>
                  {work.description}
                </p>
                {work.description.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-purple-500 font-medium mt-2 hover:text-purple-600 transition"
                  >
                    {showFullDescription ? 'Ler menos...' : 'Ler mais...'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Personagens */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Personagens ({characters.length})
              </h3>
              {canCreateWork() && (
                <button
                  onClick={() => setShowAddCharacter(true)}
                  className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
                >
                  <PlusIcon className="w-5 h-5" />
                  Adicionar
                </button>
              )}
            </div>

            {characters.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Nenhum personagem cadastrado ainda</p>
                {canCreateWork() && (
                  <button
                    onClick={() => setShowAddCharacter(true)}
                    className="text-purple-500 font-medium hover:text-purple-600"
                  >
                    Adicionar primeiro personagem
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {characters.map((character) => (
                  <div
                    key={character._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    style={{ borderLeftWidth: '4px', borderLeftColor: character.defaultColor }}
                  >
                    <div className="flex items-start gap-3">
                      {character.image && (
                        <img
                          src={character.image}
                          alt={character.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {character.name}
                        </h4>
                        {character.alias && character.alias.length > 0 && (
                          <p className="text-xs text-gray-500 truncate">
                            aka {character.alias[0]}
                          </p>
                        )}
                        {character.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {character.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categoria */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">Categoria:</span>
              <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium">
                {work.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Adicionar Personagem */}
      {showAddCharacter && (
        <AddCharacter
          workId={id}
          onClose={() => setShowAddCharacter(false)}
          onSuccess={handleCharacterAdded}
        />
      )}
    </div>
  );
};

export default WorkDetails;