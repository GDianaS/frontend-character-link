import React from 'react';
import { workService } from '../../api';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import WorkCard from '../../components/WorkCard';
import Filtro from '../../components/Filtro';

const Works = () => {
  
  return (

    <div className="flex flex-col">
      <div className="flex">
        <h1>Obras</h1>
        <SearchBar/>
      </div>

      <div className='flex gap-4'>
        <div className="flex flex-col bg-white rounded-2xl shadow-md p-4">
          <h2>Obras:</h2>
          <div className="grid grid-cols-6 gap-4">
            <WorkCard category="book"/>
            <WorkCard/>
            <WorkCard/>
            <WorkCard/>
            <WorkCard/>
            <WorkCard/>
            <WorkCard/>
          </div>
        </div>

        {/* Resultados */}
        <div className="flex bg-white rounded-2xl shadow-md p-4">
          <Filtro/>
        </div>
      </div>
      {/* Resultados */}
    </div>
    
  );
};

export default Works;