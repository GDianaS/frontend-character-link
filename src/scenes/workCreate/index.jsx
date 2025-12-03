// import { ChevronLeftIcon } from "@heroicons/react/24/outline";
// import FormCreateWork from "./components/FormCreateWork";
// import { useNavigate } from "react-router-dom";

// function WorkCreate(){

//     const navigate = useNavigate();

//     const handleBack = () => {
//         navigate(-1)
//     };

//     return(
//         <div className="flex flex-col bg-white shadow-md rounded-2xl p-4 mt-2">
//             {/* Voltar */}
//             <button 
//             onClick={handleBack}
//             className="flex items-center gap-2 mb-6 text-gray-800 hover:text-gray-900 transition">
//                 <ChevronLeftIcon className="size-6 text-gray-800 hover:text-gray-900 transition"/>
//             <span className="font-medium">Voltar</span>
//             </button>

//             <h2 className="px-4 pt-2">Cadastrar Nova Obra:</h2>
//             <FormCreateWork/>
            
//         </div>
//     )
// };



// export default WorkCreate;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { workService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function WorkCreate() {
  const navigate = useNavigate();
  const { canCreateWork } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    author: '',
    description: '',
    category: '',
    status: 'notStarted',
    isPublic: false,
    imageCover: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'book', label: 'Livro' },
    { value: 'movie', label: 'Filme' },
    { value: 'serie', label: 'Série' },
    { value: 'manga', label: 'Mangá' },
    { value: 'ebook', label: 'E-book' },
    { value: 'novel', label: 'Novel' },
    { value: 'comic', label: 'HQ' },
    { value: 'theater', label: 'Teatro' },
    { value: 'audiobook', label: 'Audiobook' },
    { value: 'fanfic', label: 'Fanfic' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Imagem muito grande! Máximo 5MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, imageCover: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canCreateWork()) {
      alert('Faça login para criar obras!');
      return;
    }

    if (!formData.title || !formData.category) {
      alert('Preencha título e categoria');
      return;
    }

    setLoading(true);
    try {
      const response = await workService.create(formData);
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
    <div className="flex-1 p-8 min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-gray-700 hover:text-gray-900 transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Voltar</span>
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">Cadastrar Nova Obra</h2>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Linha 1: Título e Subtítulo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Título *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Harry Potter"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Subtítulo
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Ex: E a Pedra Filosofal"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Linha 2: Autor e Categoria */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Autor/Criador
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Ex: J.K. Rowling"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
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
                <option value="">Selecione...</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div>
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

          {/* Upload de Imagem */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Imagem de Capa
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition">
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
                  <PhotoIcon className="w-16 h-16 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 font-medium mb-1">Clique para selecionar</p>
                  <p className="text-sm text-gray-500">PNG, JPG ou GIF (máx 5MB)</p>
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

          {/* Público */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Tornar esta obra pública
              </span>
            </label>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4 pt-4">
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
      </div>
    </div>
  );
}

export default WorkCreate;