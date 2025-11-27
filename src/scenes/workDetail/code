// src/scenes/workDetail/index.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workService, characterService } from './../../api';

const WorkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCharacterForm, setShowCharacterForm] = useState(false);

  const [characterForm, setCharacterForm] = useState({
    name: '',
    description: '',
    alias: '',
    status: 'Vivo',
    image: ''
  });

  // Usar useCallback para evitar o warning do ESLint
  const fetchWorkDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Buscando obra com ID:', id); // Debug
      
      const [workRes, charactersRes] = await Promise.all([
        workService.getById(id),
        workService.getCharacters(id)
      ]);
      
      console.log('Resposta da obra:', workRes.data); // Debug
      console.log('Resposta dos personagens:', charactersRes.data); // Debug
      
      setWork(workRes.data.data.work);
      setCharacters(charactersRes.data.data.characters || []);
    } catch (err) {
      console.error('Erro ao buscar detalhes:', err);
      console.error('Resposta do erro:', err.response?.data); // Debug
      setError(err.response?.data?.message || 'Erro ao carregar obra');
    } finally {
      setLoading(false);
    }
  }, [id]); // Adicionar id como dependência

  useEffect(() => {
    fetchWorkDetails();
  }, [fetchWorkDetails]); // Agora fetchWorkDetails está na dependência

  const handleCharacterSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...characterForm,
        alias: characterForm.alias.split(',').map(a => a.trim()).filter(Boolean)
      };
      await characterService.createForWork(id, data);
      setShowCharacterForm(false);
      setCharacterForm({
        name: '',
        description: '',
        alias: '',
        status: 'Vivo',
        image: ''
      });
      fetchWorkDetails();
    } catch (err) {
      console.error('Erro ao criar personagem:', err);
      alert('Erro ao criar personagem: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Erro</p>
          <p>{error}</p>
          <button
            onClick={() => navigate('/works')}
            className="mt-2 text-blue-600 hover:underline"
          >
            ← Voltar para obras
          </button>
        </div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="font-bold">Obra não encontrada</p>
          <p>ID: {id}</p>
          <button
            onClick={() => navigate('/works')}
            className="mt-2 text-blue-600 hover:underline"
          >
            ← Voltar para obras
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header da Obra */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <button
          onClick={() => navigate('/works')}
          className="text-blue-600 hover:underline mb-4"
        >
          ← Voltar para obras
        </button>

        <div className="flex gap-6">
          {work.imageCover && (
            <img
              src={work.imageCover}
              alt={work.title}
              className="w-48 h-72 object-cover rounded"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{work.title}</h1>
            {work.author && (
              <p className="text-gray-600 mb-4">por {work.author}</p>
            )}
            <p className="text-gray-700 mb-4">{work.description}</p>
            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                {work.category}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded">
                {work.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Personagens */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Personagens ({characters.length})
          </h2>
          <button
            onClick={() => setShowCharacterForm(!showCharacterForm)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {showCharacterForm ? 'Cancelar' : 'Adicionar Personagem'}
          </button>
        </div>

        {showCharacterForm && (
          <form onSubmit={handleCharacterSubmit} className="bg-gray-50 p-4 rounded mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome *</label>
                <input
                  type="text"
                  value={characterForm.name}
                  onChange={(e) => setCharacterForm({...characterForm, name: e.target.value})}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <input
                  type="text"
                  value={characterForm.status}
                  onChange={(e) => setCharacterForm({...characterForm, status: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Vivo, Morto, Desconhecido..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={characterForm.description}
                  onChange={(e) => setCharacterForm({...characterForm, description: e.target.value})}
                  rows="3"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Apelidos (separados por vírgula)
                </label>
                <input
                  type="text"
                  value={characterForm.alias}
                  onChange={(e) => setCharacterForm({...characterForm, alias: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Apelido 1, Apelido 2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL da Imagem</label>
                <input
                  type="text"
                  value={characterForm.image}
                  onChange={(e) => setCharacterForm({...characterForm, image: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Criar Personagem
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {characters.map((character) => (
            <div
              key={character._id}
              onClick={() => navigate(`/characters/${character._id}`)}
              className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition"
            >
              {character.image && (
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
              )}
              <h3 className="font-bold text-lg mb-1">{character.name}</h3>
              {character.status && (
                <p className="text-sm text-gray-600 mb-2">{character.status}</p>
              )}
              <p className="text-sm text-gray-700 line-clamp-2">
                {character.description}
              </p>
            </div>
          ))}
        </div>

        {characters.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum personagem cadastrado ainda.
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkDetail;