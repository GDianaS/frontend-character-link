import {  
    InformationCircleIcon,
    BookOpenIcon,
    SparklesIcon,
    CubeTransparentIcon
} from '@heroicons/react/24/outline';

const CATEGORY_COLORS = {
    book: "bg-indigo-50 text-indigo-700",
    movie: "bg-red-50 text-red-700",
    manga: "bg-pink-50 text-pink-700",
    ebook: "bg-blue-50 text-blue-700",
    novel: "bg-purple-50 text-purple-700",
    comic: "bg-orange-50 text-orange-700",
    series: "bg-green-50 text-green-700",
    theater: "bg-yellow-50 text-yellow-700",
    audiobook: "bg-cyan-50 text-cyan-700",
    fanfic: "bg-violet-50 text-violet-700",
};

function CategoryBadge({ label }) {
    const color = CATEGORY_COLORS[label] || "bg-gray-50 text-gray-700";

    return (
        <span
            className={`
                px-3 py-1 
                rounded-full 
                text-xs 
                font-medium
                ${color}
            `}
        >
            {label}
        </span>
    );
}

function About() {
    const categories = Object.keys(CATEGORY_COLORS);

    return (
        <div className="w-full flex justify-center px-4 mt-14 mb-24 bg-white">
            <div className="w-full max-w-3xl space-y-20">

                {/* Cabeçalho */}
                <header className="flex items-center gap-3">
                    <InformationCircleIcon className="h-8 w-8 text-gray-800" />
                    <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                        Sobre o Sistema
                    </h1>
                </header>

                {/* Descrição */}
                <p className="text-gray-600 text-lg leading-relaxed">
                    Este sistema foi desenvolvido para gerenciar suas obras favoritas com uma
                    interface leve, minimalista e intuitiva. A proposta é permitir uma navegação
                    clara e sem distrações, focada no essencial.
                </p>

                {/* Objetivo */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="h-6 w-6 text-gray-700" />
                        <h2 className="text-xl font-medium text-gray-900">Objetivo</h2>
                    </div>

                    <p className="text-gray-600 leading-relaxed">
                        O objetivo é proporcionar um ambiente simples e organizado para registrar,
                        acompanhar e visualizar suas obras, mantendo tudo acessível e agradável.
                    </p>
                </section>

                {/* Categorias */}
                <section className="space-y-5">
                    <div className="flex items-center gap-2">
                        <BookOpenIcon className="h-6 w-6 text-gray-700" />
                        <h3 className="text-xl font-medium text-gray-900">
                            Categorias Suportadas
                        </h3>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <CategoryBadge key={category} label={category} />
                        ))}
                    </div>
                </section>

                {/* Tecnologias */}
                <section className="space-y-5">
                    <div className="flex items-center gap-2">
                        <CubeTransparentIcon className="h-6 w-6 text-gray-700" />
                        <h3 className="text-xl font-medium text-gray-900">
                            Tecnologias Utilizadas
                        </h3>
                    </div>

                    <ul className="list-disc ml-6 text-gray-600 space-y-2 text-md">
                        <li>React + Vite</li>
                        <li>TailwindCSS</li>
                        <li>Node.js & Express</li>
                        <li>MongoDB</li>
                    </ul>
                </section>

            </div>
        </div>
    );
}

export default About;
