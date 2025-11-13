import React from 'react';
import { workService } from '../../api';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Works = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    status: 'notStarted',
    category: 'book',
    isPublic: false,
    imageCover: ''
  });

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      setLoading(true);
      const response = await workService.getAll();
      setWorks(response.data.data.works);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar obras');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await workService.create(formData);
      setShowForm(false);
      setFormData({
        title: '',
        author: '',
        description: '',
        status: 'notStarted',
        category: 'book',
        isPublic: false,
        imageCover: ''
      });
      fetchWorks();
    } catch (err) {
      setError('Erro ao criar obra');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) return <div className="p-4">Carregando...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div>
      <div className='flex flex-col pt-12 pb-6 justify-center items-center gap-3'>
        <h1 className='text-2xl font-semibold'>Obras Mapeadas</h1>
        <h2 className='text-sm text-center'>A central de comando para todos os seus universos de ficção. Visualize, edite e organize cada Obra e seu elenco de personagens.</h2>        
      </div>

      <button
        className=''
        onClick={()=> setShowForm(!showForm)}>
          {showForm ? 'Cancelar':'Nova Obra'}
      </button>

      <div className='bg-white/50 w-10/12 px-6 pt-12 pb-16 shadow-box-glass'>
        

        {/* LISTA DE OBRAS */}
        <div >
          {works.map((work) => (
            <div
              key={work._id}
              className='bg-white/80 rounded-xl border-white border-2 p-4'
            >
              {work.title}
            </div>
          ))}
        </div>



      </div>

      {showForm &&(
        <form className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div>
            <label>Título</label>
            <input 
              type='text'
              name ='title'
              value={formData.title}
              onChange={handleChange}
              required
              />
          </div>
        </form>
      )}

    </div>
  );
};

export default Works;