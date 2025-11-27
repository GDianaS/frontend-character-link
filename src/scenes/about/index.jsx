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

function About(){
    const categories = [
        'book', 'movie', 'manga', 'ebook', 'novel', 
        'comic', 'series', 'theater', 'audiobook', 'fanfic'
    ];

    return(
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Categorias Suportadas</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                        <CategoryBadge key={index} label={category} />
                    ))}
            </div>
        </div>
    )
};

export default About;