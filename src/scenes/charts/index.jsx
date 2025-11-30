import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Background, 
  Controls, 
  MiniMap, 
  Panel, 
  ReactFlow, 
  useNodesState, 
  useEdgesState, 
  useReactFlow,
  addEdge,
  ReactFlowProvider
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DnDProvider, useDnD } from './DnDContext';
import {chartService} from '../../services/api';
import {useAuth} from '../../contexts/AuthContext';
import Toolbar from './components/Toolbar';
import { ArrowLeftIcon, CheckIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";

// cada novo node recebe um ID único como "character_1"
let id = 0;
const getId = () => `character_${id++}`;

// FlowChart
function FlowChart({chartId, initialData}){
  
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData?.edges || []);
  const [rfInstance, setRfInstance] = useState(null); //guarda a instância do React Flow para exportar e salvar.
  const { screenToFlowPosition, setViewport } = useReactFlow();
  const [type] = useDnD();
  const { canSave, isGuest } = useAuth(); //Verifica permissões do usuário.
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(()=> {
    if (initialData?.viewport) {
      const { x = 0, y = 0, zoom = 1 } = initialData.viewport;
      setViewport({ x, y, zoom });
    }
  }, [initialData, setViewport]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ 
      ...params, 
      type: 'smoothstep', 
      label: 'conectado' 
    }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const colors = ['#A8C4F0', '#FFB3D9', '#C3B8F7', '#8FD8D3', '#FFBC99'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newNode = {
        id: getId(),
        type: type.type || 'default',
        position,
        data: { 
          label: type.name || 'Novo Personagem',
          characterId: type.characterId
        },
        style: { 
          background: type.color || randomColor, 
          border: `2px solid ${type.color || randomColor}dd`, 
          borderRadius: '8px', 
          padding: '10px',
          fontSize: '12px',
          fontWeight: '500'
        }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, setNodes]
  );

  // Salvar chart
  const handleSave = useCallback(async () => {
    if (!canSave()) {
      alert('Convidados não podem salvar charts. Faça login para salvar!');
      return;
    }

    if (!rfInstance) return;

    setSaving(true);
    try {
      const flow = rfInstance.toObject();
      
      if (chartId) {
        // Atualizar chart existente
        await chartService.saveSnapshot(chartId, { flowData: flow });
        alert('Chart salvo com sucesso!');
      } else {
        // Criar novo chart (redirecionar para modal de criação)
        alert('Por favor, primeiro crie um chart com título e obras relacionadas.');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar o chart');
    } finally {
      setSaving(false);
    }
  }, [rfInstance, canSave, chartId]);

  // Exportar como imagem (funciona para convidados)
  const handleExport = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      const dataStr = JSON.stringify(flow, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chart-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }, [rfInstance]);


  return(
      <div className="flex-1 h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setRfInstance}
          fitView
        >
          <Controls />
          <Background color="#e2e8f0" gap={16} />
          <MiniMap 
            nodeColor={(node) => node.style?.background || '#e2e8f0'}
            nodeStrokeWidth={2}
            zoomable
            pannable
          />
          <Panel position="top-left">
            <div className="bg-white rounded-lg shadow-md p-3">
              <h3 className="text-sm font-bold text-gray-800 mb-1">
                Mapa de Relacionamentos
              </h3>
              <p className="text-xs text-gray-600">Personagens: {nodes.length}</p>
            </div>
          </Panel>
          <Panel position="top-right">
            <div className="flex gap-2">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition"
                title="Voltar"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleExport}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                title="Exportar JSON"
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
              </button>
              {canSave() && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              )}
            </div>
          </Panel>
          {isGuest && (
          <Panel position="bottom-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-md">
              <p className="text-sm text-yellow-800">
                ⚠️ Modo Convidado: Você pode criar mapas, mas eles não serão salvos.
              </p>
            </div>
          </Panel>
        )}
        </ReactFlow>
      </div>
  )

}

// Componente Principal
function Charts() {
  const { id: chartId } = useParams();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chartId) {
      loadChart();
    }
  }, [chartId]);

  const loadChart = async () => {
    setLoading(true);
    try {
      const response = await chartService.getById(chartId);
      setChartData(response.data.data.chart.flowData);
    } catch (error) {
      console.error('Erro ao carregar chart:', error);
      alert('Erro ao carregar o chart');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <ReactFlowProvider>
      <DnDProvider>
        <div className="flex h-screen bg-white gap-4 p-4">
          <FlowChart chartId={chartId} initialData={chartData} />
          <Toolbar chartId={chartId} />
        </div>
      </DnDProvider>
    </ReactFlowProvider>
  );
}

export default Charts;




// Nodes e Edges iniciais
// const initialNodes = [
//   { 
//     id: "n1", 
//     position: { x: 100, y: 100 }, 
//     data: { label: "Harry Potter" },
//     style: { 
//       background: '#A8C4F0', 
//       border: '2px solid #6B96D8', 
//       borderRadius: '8px', 
//       padding: '10px' 
//     }
//   },
//   { 
//     id: "n2", 
//     position: { x: 300, y: 100 }, 
//     data: { label: "Hermione Granger" },
//     style: { 
//       background: '#FFB3D9', 
//       border: '2px solid #FF80C0', 
//       borderRadius: '8px', 
//       padding: '10px' 
//     }
//   },
// ];

// const initialEdges = [
//   { 
//     id: "n1-n2", 
//     source: "n1", 
//     target: "n2", 
//     label: "amigos", 
//     type: 'smoothstep' 
//   }
// ];

// let id = 0;
// const getId = () => `character_${id++}`;

// // Componente FlowChart
// function FlowChart() {
//   const reactFlowWrapper = useRef(null);
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
//   const { screenToFlowPosition } = useReactFlow();
//   const [type] = useDnD();

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge({ 
//       ...params, 
//       type: 'smoothstep', 
//       label: 'conectado' 
//     }, eds)),
//     []
//   );

//   const onDragOver = useCallback((event) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = 'move';
//   }, []);

//   const onDrop = useCallback(
//     (event) => {
//       event.preventDefault();

//       if (!type) {
//         return;
//       }

//       const position = screenToFlowPosition({
//         x: event.clientX,
//         y: event.clientY,
//       });

//       const colors = ['#A8C4F0', '#FFB3D9', '#C3B8F7', '#8FD8D3', '#FFBC99'];
//       const randomColor = colors[Math.floor(Math.random() * colors.length)];

//       const newNode = {
//         id: getId(),
//         type: type.type || 'default',
//         position,
//         data: { label: type.name || 'Novo Personagem' },
//         style: { 
//           background: randomColor, 
//           border: `2px solid ${randomColor}dd`, 
//           borderRadius: '8px', 
//           padding: '10px',
//           fontSize: '12px',
//           fontWeight: '500'
//         }
//       };

//       setNodes((nds) => nds.concat(newNode));
//     },
//     [screenToFlowPosition, type, setNodes]
//   );

//   return (
//     <div className="flex-1" ref={reactFlowWrapper}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         onDrop={onDrop}
//         onDragOver={onDragOver}
//         fitView
//       >
//         <Controls />
//         <Background color="#e2e8f0" gap={16} />
//         <MiniMap 
//           nodeColor={(node) => node.style?.background || '#e2e8f0'}
//           nodeStrokeWidth={2}
//           zoomable
//           pannable
//         />
//         <Panel position="top-left">
//           <div className="bg-white rounded-lg p-3">
//             <h3 className="text-[14px] font-bold text-gray-800">
//               Título do Mapa de Relacionamentos
//             </h3>
//             <p className="text-gray-500">Personagens: {nodes.length}</p>
//           </div>
//         </Panel>
//       </ReactFlow>
//     </div>
//   );
// }

// // Componente Principal
// export default function Charts() {
//   return (
//     <ReactFlowProvider>
//       <DnDProvider>
//         <div className="flex h-screen bg-white p-4 gap-4">
//             <FlowChart />
//             <Toolbar />
//         </div>
//       </DnDProvider>
//     </ReactFlowProvider>
//   );
// }