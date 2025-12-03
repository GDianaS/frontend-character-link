import { useState } from "react";
import { workService } from "../../../services/api";
import { useNavigate } from "react-router-dom";

function FormCreateWork() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        author: "",
        description: "",
        status: "notStarted",
        category: "",
        isPublic: false,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

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
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.category) {
            alert('Título e categoria são obrigatórios');
            return;
        }

        setLoading(true);
        try {
            // Criar FormData para enviar arquivo
            const formDataToSend = new FormData();
            
            // Adicionar campos de texto
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            // Adicionar imagem se houver
            if (imageFile) {
                formDataToSend.append('imageCover', imageFile);
            }

            const response = await workService.create(formDataToSend);
            
            alert('Obra criada com sucesso!');
            navigate(`/works/${response.data.data.work._id}`);
        } catch (error) {
            console.error('Erro ao criar obra:', error);
            alert(error.response?.data?.message || 'Erro ao criar obra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6">
            {/* Título */}
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-600">
                    Título *
                </label>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Harry Potter"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />
            </div>

            {/* Subtítulo */}
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-600">
                    Subtítulo
                </label>
                <input
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    placeholder="Ex: E a Pedra Filosofal"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            {/* Autor */}
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-600">
                    Autor
                </label>
                <input
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Ex: J.K. Rowling"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            {/* Descrição */}
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-600">
                    Descrição
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Descreva a obra..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
            </div>

            {/* Categoria */}
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-600">
                    Categoria *
                </label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                >
                    <option value="">Selecione uma categoria</option>
                    <option value="book">Livro</option>
                    <option value="movie">Filme</option>
                    <option value="serie">Série</option>
                    <option value="manga">Mangá</option>
                    <option value="ebook">E-book</option>
                    <option value="novel">Novel</option>
                    <option value="comic">HQ</option>
                    <option value="theater">Teatro</option>
                    <option value="audiobook">Audiobook</option>
                    <option value="fanfic">Fanfic</option>
                </select>
            </div>

            {/* Upload de Imagem */}
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-600">
                    Imagem de Capa
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition">
                    {imagePreview ? (
                        <div className="flex flex-col items-center gap-4">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-h-64 rounded-lg shadow-md"
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
                        <label className="cursor-pointer block">
                            <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-600 font-medium mb-1">Clique para selecionar uma imagem</p>
                            <p className="text-xs text-gray-500">PNG, JPG, WEBP (máx 5MB)</p>
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

            {/* Botões */}
            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
                >
                    {loading ? 'Criando...' : 'Criar Obra'}
                </button>
            </div>
        </form>
    );
}

export default FormCreateWork;