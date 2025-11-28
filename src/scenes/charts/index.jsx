import { useState, useCallback, useRef } from "react";
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
import Toolbar from './components/Toolbar';

// Nodes e Edges iniciais
const initialNodes = [
  { 
    id: "n1", 
    position: { x: 100, y: 100 }, 
    data: { label: "Harry Potter" },
    style: { 
      background: '#A8C4F0', 
      border: '2px solid #6B96D8', 
      borderRadius: '8px', 
      padding: '10px' 
    }
  },
  { 
    id: "n2", 
    position: { x: 300, y: 100 }, 
    data: { label: "Hermione Granger" },
    style: { 
      background: '#FFB3D9', 
      border: '2px solid #FF80C0', 
      borderRadius: '8px', 
      padding: '10px' 
    }
  },
];

const initialEdges = [
  { 
    id: "n1-n2", 
    source: "n1", 
    target: "n2", 
    label: "amigos", 
    type: 'smoothstep' 
  }
];

let id = 0;
const getId = () => `character_${id++}`;

// Componente FlowChart
function FlowChart() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ 
      ...params, 
      type: 'smoothstep', 
      label: 'conectado' 
    }, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!type) {
        return;
      }

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
        data: { label: type.name || 'Novo Personagem' },
        style: { 
          background: randomColor, 
          border: `2px solid ${randomColor}dd`, 
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

  return (
    <div className="flex-1" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
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
          <div className="bg-white rounded-lg p-3">
            <h3 className="text-[14px] font-bold text-gray-800">
              Título do Mapa de Relacionamentos
            </h3>
            <p className="text-gray-500">Personagens: {nodes.length}</p>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

// Componente Principal
export default function Charts() {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <div className="flex h-screen bg-white p-4 gap-4">
            <FlowChart />
            <Toolbar />
        </div>
      </DnDProvider>
    </ReactFlowProvider>
  );
}