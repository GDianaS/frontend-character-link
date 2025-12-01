import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { workService } from "../../../services/api";
import { useNavigate } from "react-router-dom";

// Componente Input Customizado
function InputCustom({
    label,
    name,
    placeholder,
    type = "text",
    value,
    onChange,
    required = false,
    halfWidth = false
}){
    const id = name || label.toLowerCase().replace(" ", "-");

    return(
        <div className={`${halfWidth ? 'w-1/2' : 'w-full'}`}>
            <label 
                htmlFor={id} 
                className="block mb-2 text-sm font-bold text-myown-primary-500"
            >
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-4 py-2.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myown-primary-500 focus:border-transparent transition"
            />
        </div>
    )

};

// Componente Select Customizado
function SelectCustom({ label, name, value, onChange, options, required = false }) {
    return (
        <div className="w-full">
            <label 
                htmlFor={name} 
                className="block mb-2 text-sm font-bold text-myown-primary-500"
            >
                {label}
            </label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myown-primary-500 focus:border-transparent transition bg-white text-[12px]"
            >
                <option value="">Selecione Categoria</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function FormCreateWork(){

    const navigate = useNavigate();
    const { canSave } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        author: "",
        description: "",
        status:"notStarted",
        category: "",
        isPublic: false,
        imageCover: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const categories = [
        { value: "book", label: "Livro" },
        { value: "movie", label: "Filme" },
        { value: "serie", label: "Série" },
        { value: "manga", label: "Mangá" },
        { value: "ebook", label: "E-book" },
        { value: "novel", label: "Novel" },
        { value: "comic", label: "HQ" },
        { value: "theater", label: "Teatro" },
        { value: "audiobook", label: "Audiobook" },
        { value: "fanfic", label: "Fanfic" },
    ];

    const statusOptions = [
        {value: "notStarted", label:"A começar"},
        {value: "inProgress", label:"Em progresso"},
        {value: "completed", label:"Concluído"},
    ]

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, imageCover: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!canSave){
            alert('Faça login para criar obras!');
            return;
        }

        if(!formData.title){
            alert('Por favor, preencha o título!');
            return;
        }

        if(!formData.category){
            alert('Por favor, escolha a categoria!');
            return;
        }
        console.log("Enviando para o banco:", formData);

        try{
            const response = await workService.create({
                ...formData
            })

            const workId = response.data.data.work._id;
            navigate(`/works/${workId}`);
            
        }catch(error){
            console.error('Error ao criar obra:', error);
            alert('Error ao criar obra!');
        }
        

    };

    const handleCancel = () => {
        console.log("Cancelar");
    };

    return(
        <div className="mt-6 p-4">

            {/* Linha 1: Título e Subtítulo */}
            <div className="flex gap-6 mb-6">
                <InputCustom
                    label="Título"
                    name="title"
                    placeholder="Harry Potter"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    halfWidth
                />
                <InputCustom
                    label="Subtítulo"
                    name="subtitle"
                    placeholder="E a pedra filosofal"
                    value={formData.subtitle}
                    onChange={handleChange}
                    halfWidth
                />
            </div>

            {/* Linha 2: Autoria */}
            <div className="mb-6">
                <InputCustom
                    label="Autoria"
                    name="author"
                    placeholder="J. K. Rowling"
                    value={formData.author}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Linha 3: Descrição */}
            <div className="mb-6">
                <label 
                    htmlFor="description" 
                    className="block mb-2 text-sm font-bold text-myown-primary-500"
                >
                    Descrição
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myown-primary-500 focus:border-transparent transition resize-none"
                    placeholder="Harry Potter nunca havia ouvido falar de Hogwarts quando as cartas começaram a aparecer no capacho da Rua dos Alfeneiros, nº 4. Escritos a tinta verde-esmeralda em pergaminho amarelado com um lacre de cera púrpura, as cartas eram rapidamente confiscadas por seus pavorosos tio e tia. Então, no aniversário de onze anos de Harry, um gigante com olhos que luziam como besouros negros chamado Rúbeo Hagrid surge com notícias surpreendentes: Harry Potter é um bruxo e tem uma vaga na Escola de Magia e Bruxaria de Hogwarts. Uma incrível aventura está para começar!"
                />
            </div>

            {/* Linha 4: Categoria e Privacidade */}
            <div className="flex gap-6 mb-6">
                <SelectCustom
                    label="Categoria"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={categories}
                    required
                />
                <SelectCustom
                    label="Andamento"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={statusOptions}
                />
                <div>
                    <label className="block mb-2 text-sm font-bold text-myown-primary-500">
                        Privacidade
                    </label>
                    {/* Switch Toogle */}
                    <div className="inline-flex gap-2">
                        <div className="relative inline-block w-11 h-5">
                            <input id="switch-component-desc" type="checkbox" className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-myown-primary-400 cursor-pointer transition-colors duration-300" 
                            name="isPublic"
                            checked={formData.isPublic}
                            onChange={handleChange}/>
                            <label htmlFor="switch-component-desc" className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-myown-primary-300 cursor-pointer">
                            </label>
                        </div>

                        <label>
                            <p className="font-medium">
                                Público
                            </p>
                            <p className="text-slate-500 text-sx">
                                Ao tornar esta obra pública, ela ficará visível para todos os usuários da plataforma.
                            </p>
                        </label>

                    </div>

                </div>
            </div>

             {/* Linha 5: Upload de Imagem */}
            <div className="mb-8">
                <label className="block mb-2 text-sm font-bold text-myown-primary-500">
                    Foto de Capa
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-myown-primary-500 transition">
                    {imagePreview ? (
                        <div className="flex flex-col items-center gap-4">
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="max-h-48 rounded-lg shadow-md"
                            />
                            <label className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium">
                                Alterar imagem
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    ) : (
                        <label className="cursor-pointer">
                            <ArrowUpTrayIcon className="w-12 h-12 mb-3 text-gray-400"/>
                            <p className="text-gray-600 font-medium mb-1">Upload Foto de Capa</p>
                            <p className="text-sm text-gray-500">Clique para selecionar uma imagem</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-center gap-10">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-8 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-sm"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-myown-primary-500 text-white font-semibold rounded-lg hover:bg-myown-primary-600 transition shadow-md text-sm"
                >
                    Salvar
                </button>
            </div>


        </div>
    
    )
}


export default FormCreateWork;