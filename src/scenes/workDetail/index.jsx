import { ArrowLeftIcon, ChevronLeftIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const WorkDetails = () => {

  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Dados de teste
  const work = {
    title: "Harry Potter - E A Pedra Filosofal",
    author: "J.K. Rowling",
    category: "livro",
    coverImage: "https://images.unsplash.com/photo-1586563192986-827afefd7438?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: `Harry Potter é um garoto cujos pais, feiticeiros, foram assassinados por um poderosíssimo bruxo quando ele ainda era um bebê. Ele foi levado, então, para a casa dos tios que nada tinham a ver com o sobrenatural. Pelo contrário. Até os 10 anos, Harry foi uma espécie de gata borralheira: maltratado pelos tios, herdava roupas velhas do primo gorducho, tinha óculos remendados e era tratado como um estorvo. No dia de seu aniversário de 11 anos, entretanto, ele parece deslizar por um buraco sem fundo, como o de Alice no país das maravilhas, que o conduz a um mundo mágico. Descobre sua verdadeira história e seu destino: ser um aprendiz de feiticeiro até o dia em que terá que enfrentar a pior força do mal, o homem que assassinou seus pais. O menino de olhos verde, magricela e desengonçado, tão habituado à rejeição, descobre, também, que é um herói no universo dos magos. Potter fica sabendo que é a única pessoa a ter sobrevivido a um ataque do tal bruxo.`,
    publicCharts: [
      "Mapa Título - Personagens Livro",
      "Mapa Título - Personagens Livro",
      "Mapa Título - Personagens Livro",
      "Mapa Título - Personagens Livro"
    ],
    relatedWorks: [
      {
        id: 1,
        title: "Harry Potter 2",
        image: "https://plus.unsplash.com/premium_photo-1726768903173-8cac387e97ab?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 2,
        title: "Harry Potter 3",
        image: "https://images.unsplash.com/photo-1597590094308-e283f0f2030b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 3,
        title: "Harry Potter 4",
        image: "https://images.unsplash.com/photo-1600189261900-da2183219c28?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
    ]
  };

  const handleBack = () => {
    console.log("Voltar");
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };


  return(
    <div className="flex-1 p-8 min-h-screen bg-white rounded-2xl shadow-md ">
      <div className="flex justify-between">
        {/* Voltar */}
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 text-gray-800 hover:text-gray-900 transition">
            <ChevronLeftIcon className="size-6 text-gray-800 hover:text-gray-900 transition"/>
          <span className="font-medium">Voltar</span>
        </button>
        <span>Editar</span>
      </div>

      {/* Body */}
      <div className="flex gap-8">

        {/* LADO ESQUERDO */}
        <div className="w-2/5">
        {/* Imagem de Capa */}
            <img 
              src={work.coverImage} 
              alt={work.title}
              className="w-full h-[400px] object-cover rounded-xl"
            />

            {/* Obras Relacionadas */}
            <div>
              <h2>Obras Relacionadas:</h2>
              <div className="flex gap-4">
              {work.relatedWorks.map((related) => (
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

            {/* Informações - LADO DIREITO*/}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex justify-between items-start mb-4">{/* Título + Autoria + Favoritos*/}
                <div className="flex-1"> {/* Título + Autoria */}
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

              {/* Descrição */}
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

                {/* Charts Públicos */}
                <h2> Charts Públicos:</h2>

                {/* Meus Charts */}
                <h2> Meus Charts:</h2>


            </div>
            
      </div>

    </div>
  )

}

export default WorkDetails;