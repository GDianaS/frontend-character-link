import { GlobeAltIcon, LockClosedIcon } from '@heroicons/react/24/outline';

function WorkPrivacyToggle({ isPublic, onChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Privacidade da Obra
      </label>
      
      <div className="flex gap-3">
        {/* Opção Pública */}
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-lg transition ${
            isPublic
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isPublic ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <GlobeAltIcon className={`w-5 h-5 ${
              isPublic ? 'text-green-600' : 'text-gray-500'
            }`} />
          </div>
          <div className="flex-1 text-left">
            <p className={`font-semibold ${
              isPublic ? 'text-green-900' : 'text-gray-700'
            }`}>
              Público
            </p>
            <p className="text-xs text-gray-500">
              Visível para todos os usuários
            </p>
          </div>
          {isPublic && (
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>

        {/* Opção Privada */}
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-lg transition ${
            !isPublic
              ? 'border-amber-500 bg-amber-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            !isPublic ? 'bg-amber-100' : 'bg-gray-100'
          }`}>
            <LockClosedIcon className={`w-5 h-5 ${
              !isPublic ? 'text-amber-600' : 'text-gray-500'
            }`} />
          </div>
          <div className="flex-1 text-left">
            <p className={`font-semibold ${
              !isPublic ? 'text-amber-900' : 'text-gray-700'
            }`}>
              Privado
            </p>
            <p className="text-xs text-gray-500">
              Apenas você pode ver
            </p>
          </div>
          {!isPublic && (
            <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Explicação */}
      <div className={`p-3 rounded-lg border ${
        isPublic 
          ? 'bg-green-50 border-green-200' 
          : 'bg-amber-50 border-amber-200'
      }`}>
        <p className={`text-xs ${
          isPublic ? 'text-green-700' : 'text-amber-700'
        }`}>
          {isPublic ? (
            <>
              ✓ Esta obra será visível na lista de obras para todos os usuários (autenticados e convidados)
            </>
          ) : (
            <>
              🔒 Esta obra só aparecerá na sua lista de obras e não será visível para outros usuários
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default WorkPrivacyToggle;