import { ArrowLeftIcon, ChevronLeftIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { workService } from "../../services/api";

const WorkDetails = () => {

  const { id } = useParams();

  // Todos os hooks aqui em cima!
  const [work, setWork] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const response = await workService.getById(id);
        setWork(response.data.data.work);
      } catch (error) {
        console.error("Erro ao carregar obra", error);
      }
    };

    fetchWork();
  }, [id]);

  // Agora é seguro usar return condicional
  if (!work) return <p>Carregando...</p>;

  const handleBack = () => {
    window.history.back();
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return(
    <div className="flex-1 p-8 min-h-screen bg-white rounded-2xl shadow-md ">
      <div className="flex justify-between">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 text-gray-800 hover:text-gray-900 transition">
            <ChevronLeftIcon className="size-6"/>
          <span className="font-medium">Voltar</span>
        </button>
        <span>Editar</span>
      </div>

      <div className="flex gap-8">

        {/* LADO ESQUERDO */}
        <div className="w-2/5">
            <img 
              src={work.coverImage} 
              alt={work.title}
              className="w-full h-[400px] object-cover rounded-xl"
            />

            <div>
              <h2>Obras Relacionadas:</h2>
              <div className="flex gap-4">
              {work.relatedWorks?.map((related) => (
                <div 
                  key={related.id}
                  className="cursor-pointer hover:opacity-80 transition"
                >
                  <span>{related.title}</span>
                  <img 
                    src={related.image} 
                    alt={related.title}
                    className="w-full h-[150px] object-cover rounded-lg shadow-sm"
                  />
                </div>
              ))}
              </div>
            </div>
        </div>

        {/* LADO DIREITO */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-myown-primary-500 mb-2">
                  {work.title}
              </h2>
              <p className="text-gray-600">
                  Por: <span className="text-myown-primary-500 font-medium">{work.author}</span>
              </p>
            </div>

            <button 
              onClick={toggleFavorite}
              className={`p-2 rounded-full transition ${
              isFavorite 
                ? 'bg-myown-terciary-100 text-myown-primary-500' 
                : 'bg-gray-100 text-gray-400 hover:bg-myown-terciary-50 hover:text-myown-terciary-200'
            }`}>
              <HeartIcon className={`size-6 ${isFavorite? 'fill-current':''}`}/>
            </button>
          </div>

          <div className="text-gray-700 leading-relaxed">
            <p className={`${!showFullDescription ? 'line-clamp-6' : ''}`}>
              {work.description}
            </p>
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-myown-primary-500 font-medium mt-2 hover:text-myown-primary-600 transition"
            >
              {showFullDescription ? 'Ler menos.' : 'Ler mais.'}
            </button>
          </div>

          <h2> Charts Públicos:</h2>
          <h2> Meus Charts:</h2>
        </div>
      </div>
    </div>
  )
}

export default WorkDetails;
