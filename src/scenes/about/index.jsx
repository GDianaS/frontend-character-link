import { 
    InformationCircleIcon,
    BookOpenIcon,
    SparklesIcon,
    CubeTransparentIcon
} from '@heroicons/react/24/outline';

// Componente de Badge de Categoria
function CategoryBadge({ label }) {
    const colors = [
        'bg-purple-100 text-purple-700',
        'bg-blue-100 text-blue-700',
        'bg-pink-100 text-pink-700',
        'bg-green-100 text-green-700',
        'bg-yellow-100 text-yellow-700',
        'bg-red-100 text-red-700',
        'bg-indigo-100 text-indigo-700',
        'bg-orange-100 text-orange-700',
        'bg-cyan-100 text-cyan-700',
        'bg-violet-100 text-violet-700',
    ];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${randomColor}`}>
            {label}
        </span>
    );
}

function About() {
    const categories = [
        'book', 'movie', 'manga', 'ebook', 'novel', 
        'comic', 'series', 'theater', 'audiobook', 'fanfic'
    ];

    return (
        <div className="max-w-4xl mx-auto mt-10 mb-16 p-8 bg-white rounded-2xl shadow-lg">

            {/* Título */}
            <div className="flex items-center gap-3 mb-6">
                <InformationCircleIcon className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Sobre o Sistema</h1>
            </div>

            {/* Descrição */}
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                Este sistema foi desenvolvido para gerenciar, catalogar e organizar diferentes tipos de obras,
                incluindo livros, filmes, mangás, séries e muito mais. A proposta é oferecer uma experiência simples,
                moderna e eficiente, com foco em facilidade de uso e elegância visual.
            </p>

            {/* Seção de Objetivo */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                    <SparklesIcon className="h-6 w-6 text-yellow-600" />
                    <h2 className="text-xl font-semibold text-gray-800">Objetivo</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                    O objetivo principal é permitir que você acompanhe suas obras favoritas, registre novas,
                    mantenha tudo organizado e visualize informações relevantes de forma clara e intuitiva.
                </p>
            </div>

            {/* Categorias */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <BookOpenIcon className="h-6 w-6 text-indigo-600" />
                    <h3 className="text-xl font-bold text-gray-800">Categorias Suportadas</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                        <CategoryBadge key={index} label={category} />
                    ))}
                </div>
            </div>

            {/* Tecnologia */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <CubeTransparentIcon className="h-6 w-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-800">Tecnologias Utilizadas</h3>
                </div>

                <ul className="list-disc ml-6 text-gray-600 space-y-1">
                    <li>React + Vite</li>
                    <li>TailwindCSS</li>
                    <li>Node.js & Express</li>
                    <li>MongoDB</li>
                </ul>
            </div>

        </div>
    );
}

export default About;
