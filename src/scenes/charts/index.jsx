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
import { chartService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Toolbar from './components/Toolbar';
import SaveChart from './components/SaveChart';
import EdgeLabel from './components/EdgeLabel';
import { ArrowLeftIcon, CheckIcon, DocumentArrowDownIcon, TrashIcon } from "@heroicons/react/24/outline";
import DownloadButton from "./components/DownloadButton";

let id = 0;
const getId = () => `character_${id++}`;

// FlowChart
function FlowChart({ chartId, initialData, selectedWorks }) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData?.edges || []);
  const [rfInstance, setRfInstance] = useState(null);
  const { screenToFlowPosition, setViewport } = useReactFlow();
  const [type] = useDnD();
  const { canSave, isGuest } = useAuth();
  const [saving, setSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showEdgeLabelModal, setShowEdgeLabelModal] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData?.viewport) {
      const { x = 0, y = 0, zoom = 1 } = initialData.viewport;
      setViewport({ x, y, zoom });
    }
  }, [initialData, setViewport]);

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'smoothstep',
        label: 'Clique para definir',
        style: { 
          stroke: '#9333ea', 
          strokeWidth: 2,
          cursor: 'pointer'
        },
        labelStyle: { 
          fill: '#6b7280', 
          fontWeight: 500,
          fontSize: 12,
          cursor: 'pointer'
        },
        data: {
          relationshipType: null,
          description: ''
        }
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
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
        },
        deletable: true
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, setNodes]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      if (deleteMode) {
        setNodes((nds) => nds.filter((n) => n.id !== node.id));
        setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
      }
    },
    [deleteMode, setNodes, setEdges]
  );

  const onEdgeClick = useCallback(
    (event, edge) => {
      event.stopPropagation();
      
      if (deleteMode) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      } else {
        // Abrir modal para editar label
        setSelectedEdge(edge);
        setShowEdgeLabelModal(true);
      }
    },
    [deleteMode, setEdges]
  );

  const handleUpdateEdgeLabel = (edgeId, relationshipType, description) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            label: relationshipType,
            data: {
              relationshipType,
              description
            },
            labelStyle: {
              ...edge.labelStyle,
              fill: '#9333ea',
              fontWeight: 600
            }
          };
        }
        return edge;
      })
    );
  };

  const handleSave = useCallback(async () => {
    if (!canSave()) {
      alert('Convidados não podem salvar charts. Faça login para salvar!');
      return;
    }

    if (!rfInstance) return;

    if (chartId) {
      setSaving(true);
      try {
        const flow = rfInstance.toObject(); // ✅ Pega o flow do ReactFlow
        await chartService.update(chartId, { flowData: flow }); // ✅ Usa 'flow' em vez de 'flowData'
        alert('Chart salvo com sucesso!');
      } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar o chart');
      } finally {
        setSaving(false);
      }
    } else {
      setShowSaveModal(true);
    }
  }, [rfInstance, canSave, chartId]);

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

  return (
    <>
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
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          fitView
          deleteKeyCode={['Backspace', 'Delete']}
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
              <p className="text-xs text-gray-600">
                Personagens: {nodes.length} | Conexões: {edges.length}
              </p>
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
                onClick={() => setDeleteMode(!deleteMode)}
                className={`p-2 rounded-lg transition ${
                  deleteMode 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title={deleteMode ? "Desativar modo deletar" : "Ativar modo deletar"}
              >
                <TrashIcon className="w-5 h-5" />
              </button>

              {/* <button
                onClick={handleExport}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                title="Exportar JSON"
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
              </button> */}
                <DownloadButton/>

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

          {deleteMode && (
            <Panel position="bottom-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-md">
                <p className="text-sm text-red-800 font-medium">
                  🗑️ Modo Deletar Ativo: Clique em nodes ou conexões para removê-los
                </p>
              </div>
            </Panel>
          )}

          {isGuest && !deleteMode && (
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

      {showSaveModal && (
        <SaveChart
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveAsNew}
          preSelectedWorks={selectedWorks}
        />
      )}

      {showEdgeLabelModal && selectedEdge && (
        <EdgeLabel
          edge={selectedEdge}
          onClose={() => {
            setShowEdgeLabelModal(false);
            setSelectedEdge(null);
          }}
          onSave={handleUpdateEdgeLabel}
        />
      )}
    </>
  );
}

// Componente Principal
function Charts() {
  const { id: chartId } = useParams();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedWorks, setSelectedWorks] = useState([]);

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
      setSelectedWorks(response.data.data.chart.works.map(w => w._id));
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
          <FlowChart 
            chartId={chartId} 
            initialData={chartData}
            selectedWorks={selectedWorks}
          />
          <Toolbar 
            chartId={chartId}
            onWorksChange={setSelectedWorks}
          />
        </div>
      </DnDProvider>
    </ReactFlowProvider>
  );
}

export default Charts;