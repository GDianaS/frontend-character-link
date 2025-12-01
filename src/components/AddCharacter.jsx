import { useState } from "react";
import { characterService } from '../services/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

function AddCharacter({ workId, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        alias: '',
        status: 'alive',
        defaultColor: '#A8C4F0'
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const colors = [
        { name: 'Azul', value: '#A8C4F0' },
        { name: 'Rosa', value: '#FFB3D9' },
        { name: 'Roxo', value: '#C3B8F7' },
        { name: 'Verde', value: '#8FD8D3' },
        { name: 'Laranja', value: '#FFBC99' },
        { name: 'Amarelo', value: '#F4D489' },
        { name: 'Vermelho', value: '#F4A6B5' },
        { name: 'Violeta', value: '#EEC4EE' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // ✅ CORRIGIDO: hadleImageChange → handleImageChange
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

        if (!formData.name) {
            alert('Nome é obrigatório');
            return;
        }

        setLoading(true);
        try {
            const characterData = {
                ...formData,
                alias: formData.alias ? formData.alias.split(',').map(a => a.trim()) : [],
                image: imagePreview || '' // Por enquanto vazio, trataremos depois
            };
            
            const response = await characterService.createForWork(workId, characterData);
            
            alert('Personagem adicionado com sucesso!');
            onSuccess(response.data.data.character);
            onClose();
        } catch (error) {
            console.error('Erro ao adicionar personagem:', error);
            alert(error.response?.data?.message || 'Erro ao adicionar personagem');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Adicionar Personagem</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    {/* Nome */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                            Nome do Personagem *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ex: Harry Potter"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    {/* Apelidos */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                            Apelidos / Aliases
                        </label>
                        <input
                            type="text"
                            name="alias"
                            value={formData.alias}
                            onChange={handleChange}
                            placeholder="Ex: O Menino que Sobreviveu, O Eleito (separados por vírgula)"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Separe múltiplos apelidos com vírgula
                        </p>
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
                            rows="4"
                            placeholder="Descreva o personagem..."
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="alive">Vivo</option>
                            <option value="dead">Morto</option>
                            <option value="unknown">Desconhecido</option>
                        </select>
                    </div>

                    {/* Cor Padrão */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                            Cor Padrão no Mapa
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, defaultColor: color.value })}
                                    className={`p-3 rounded-lg border-2 transition ${
                                        formData.defaultColor === color.value
                                            ? 'border-purple-500 ring-2 ring-purple-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    style={{ backgroundColor: `${color.value}40` }}
                                >
                                    <div
                                        className="w-8 h-8 rounded-full mx-auto"
                                        style={{ backgroundColor: color.value }}
                                    />
                                    <p className="text-xs text-gray-600 mt-1 text-center">{color.name}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Upload de Imagem - Por enquanto desabilitado */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                            Imagem do Personagem
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                            <div className="text-gray-400 mb-2">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 font-medium">Upload de imagens em breve</p>
                            <p className="text-xs text-gray-400 mt-1">Esta funcionalidade será implementada posteriormente</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !formData.name}
                        className="px-6 py-2.5 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Adicionando...' : 'Adicionar Personagem'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddCharacter;