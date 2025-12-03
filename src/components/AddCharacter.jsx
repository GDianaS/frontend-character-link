import { useState } from "react";
import { characterService } from '../services/api';
import { XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';

function AddCharacter({ workId, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        alias: '',
        status: 'alive',
        defaultColor: '#A8C4F0'
    });
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
                image: ''
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <UserPlusIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Adicionar Personagem</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* Nome */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Nome do Personagem *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ex: Harry Potter"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 
                                     focus:border-purple-500 focus:ring-2 focus:ring-purple-200
                                     outline-none transition bg-white"
                            required
                        />
                    </div>

                    {/* Apelidos */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Apelidos / Aliases
                        </label>
                        <input
                            type="text"
                            name="alias"
                            value={formData.alias}
                            onChange={handleChange}
                            placeholder="Ex: O Menino que Sobreviveu, O Eleito"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 
                                     focus:border-purple-500 focus:ring-2 focus:ring-purple-200
                                     outline-none transition bg-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            💡 Separe múltiplos apelidos com vírgula
                        </p>
                    </div>

                    {/* Descrição */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Descrição
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Descreva o personagem, sua personalidade, aparência..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 
                                     focus:border-purple-500 focus:ring-2 focus:ring-purple-200
                                     outline-none transition bg-white resize-none"
                        />
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 
                                     focus:border-purple-500 focus:ring-2 focus:ring-purple-200
                                     outline-none transition bg-white cursor-pointer"
                        >
                            <option value="alive">✨ Vivo</option>
                            <option value="dead">💀 Morto</option>
                            <option value="unknown">❓ Desconhecido</option>
                        </select>
                    </div>

                    {/* Cor Padrão */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium text-gray-700">
                            Cor Padrão no Mapa
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, defaultColor: color.value })}
                                    className={`relative p-4 rounded-xl border-2 transition group ${
                                        formData.defaultColor === color.value
                                            ? 'border-purple-500 bg-purple-50 shadow-md'
                                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                                >
                                    <div
                                        className="w-10 h-10 rounded-full mx-auto shadow-sm"
                                        style={{ backgroundColor: color.value }}
                                    />
                                    <p className={`text-xs mt-2 text-center font-medium transition ${
                                        formData.defaultColor === color.value
                                            ? 'text-purple-700'
                                            : 'text-gray-600 group-hover:text-gray-800'
                                    }`}>
                                        {color.name}
                                    </p>
                                    
                                    {/* Checkmark */}
                                    {formData.defaultColor === color.value && (
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500">
                            🎨 Esta cor será usada para representar o personagem nos mapas de relacionamentos
                        </p>
                    </div>

                    {/* Info de Imagem */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-blue-900">
                                    Upload de imagens em breve
                                </p>
                                <p className="text-xs text-blue-700 mt-1">
                                    A funcionalidade de adicionar imagens aos personagens será implementada em uma atualização futura.
                                </p>
                            </div>
                        </div>
                    </div>

                </form>

                {/* Footer */}
                <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 
                                 transition font-medium text-gray-700"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !formData.name}
                        className="px-6 py-3 rounded-xl 
                                 bg-purple-600 text-white 
                                 hover:bg-purple-700 transition 
                                 shadow-md hover:shadow-lg font-medium
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Adicionando...
                            </>
                        ) : (
                            <>
                                <UserPlusIcon className="w-5 h-5" />
                                Adicionar Personagem
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddCharacter;