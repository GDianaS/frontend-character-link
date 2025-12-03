import { 
  ArrowLeftIcon, 
  HeartIcon, 
  PlusIcon, 
  PencilSquareIcon 
} from "@heroicons/react/24/outline";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workService } from "../../services/api";
import AddCharacter from "../../components/AddCharacter";
import { useAuth } from '../../contexts/AuthContext';

const WorkDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canFavorite, canCreateWork, canEditWork, isGuest, user } = useAuth();

  const [work, setWork] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showAddCharacter, setShowAddCharacter] = useState(false);
  const [showEditWorkModal, setShowEditWorkModal] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (id) {
      loadWorkDetails();
      loadCharacters();
    }
  }, [id]);

  // const loadWorkDetails = async () => {
  //   try {
  //     const response = await workService.getById(id);
  //     const workData = response.data.data.work;

  //     setWork(workData);

  //     setEditTitle(workData.title);
  //     setEditSubtitle(workData.subtitle);
  //     setEditAuthor(workData.author);
  //     setEditDescription(workData.description);

  //   } catch (error) {
  //     console.error('Erro ao carregar obra:', error);
  //     alert('Erro ao carregar detalhes da obra');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadWorkDetails = async () => {
    try {
      const response = await workService.getById(id);
      const workData = response.data.data.work;

      // console.log("📦 Obra carregada:", workData);
      // console.log("👤 Creator da obra:", workData.creator);
      // console.log("🔑 User logado:", user);

      setWork(workData);
      setEditTitle(workData.title || '');
      setEditSubtitle(workData.subtitle || '');
      setEditAuthor(workData.author || '');
      setEditDescription(workData.description || '');
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
  };

  const handleCharacterAdded = (newCharacter) => {
    setCharacters([...characters, newCharacter]);
  };

  const handleSaveEdit = async () => {
    try {
      await workService.update(id, {
        title: editTitle,
        subtitle: editSubtitle,
        author: editAuthor,
        description: editDescription,
      });

      alert("Obra atualizada com sucesso!");
      setShowEditWorkModal(false);
      loadWorkDetails();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar obra!");
    }
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

      {/* TESTE - DEV */}
      {work && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg text-xs">
          <p><strong>Debug Info:</strong></p>
          <p>User ID: {user?.id}</p>
          <p>Creator ID: {work.creator?._id || work.creator || 'null'}</p>
          <p>Pode editar: {canEditWork(work) ? 'SIM' : 'NÃO'}</p>
        </div>
      )}
      
      {/* Voltar */}
      <button 
        onClick={handleBack}
        className="flex items-center gap-2 mb-6 text-gray-700 hover:text-gray-900 transition"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span className="font-medium">Voltar</span>
      </button>

      {/* Layout principal */}
      <div className="flex gap-8">

        {/* Imagem */}
        <div className="w-2/5">
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <img 
              src={work.imageCover || 'https://placehold.co/400x600/e2e8f0/64748b?text=Sem+Imagem'}
              alt={work.title}
              className="w-full h-[500px] object-cover rounded-xl"
            />
          </div>

          {/* BOTÃO EDITAR — somente criador ou admin */}
          {canEditWork(work) && (
            <button
              onClick={() => setShowEditWorkModal(true)}
              className="w-full bg-yellow-500 text-white py-3 rounded-xl font-medium hover:bg-yellow-600 transition flex items-center justify-center gap-2"
            >
              <PencilSquareIcon className="w-5 h-5" />
              Editar Obra
            </button>
          )}
        </div>

        {/* Informações */}
        <div className="flex-1 flex flex-col gap-6">

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
                  Por:{" "}
                  <span className="text-purple-500 font-medium">
                    {work.author}
                  </span>
                </p>

                {work.creator && (
                  <p className="text-sm text-gray-500 mt-1">
                    Criado por:{" "}
                    <span className="font-medium text-gray-700">
                      {work.creator.name}
                    </span>
                  </p>
                )}
              </div>

              {/* Favoritar */}
              <button
                onClick={toggleFavorite}
                disabled={!canFavorite()}
                className={`p-3 rounded-full transition ${
                  isFavorite 
                    ? "bg-red-100 text-red-500"
                    : canFavorite()
                    ? "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                <HeartIcon className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`} />
              </button>

            </div>

            {/* Descrição */}
            {work.description && (
              <div className="text-gray-700 leading-relaxed">
                <p className={`${!showFullDescription ? "line-clamp-6" : ""}`}>
                  {work.description}
                </p>

                {work.description.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-purple-500 font-medium mt-2 hover:text-purple-600 transition"
                  >
                    {showFullDescription ? "Ler menos..." : "Ler mais..."}
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

              {/* Criador ou admin podem adicionar personagem */}
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
              <div className="text-center py-8 text-gray-500">
                Nenhum personagem cadastrado.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {characters.map((character) => (
                  <div
                    key={character._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                  >
                    <h4 className="font-semibold text-gray-800">{character.name}</h4>
                    {character.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {character.description}
                      </p>
                    )}
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

      {/* Modal Add Personagem */}
      {showAddCharacter && (
        <AddCharacter
          workId={id}
          onClose={() => setShowAddCharacter(false)}
          onSuccess={handleCharacterAdded}
        />
      )}

      {/* Modal Editar Obra */}
      {showEditWorkModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Editar Obra</h2>

            <div className="flex flex-col gap-4">
              <input
                className="border p-2 rounded"
                placeholder="Título"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <input
                className="border p-2 rounded"
                placeholder="Subtítulo"
                value={editSubtitle}
                onChange={(e) => setEditSubtitle(e.target.value)}
              />

              <input
                className="border p-2 rounded"
                placeholder="Autor"
                value={editAuthor}
                onChange={(e) => setEditAuthor(e.target.value)}
              />

              <textarea
                className="border p-2 rounded min-h-[120px]"
                placeholder="Descrição"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditWorkModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>

              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkDetails;
