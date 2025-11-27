import { useState, useCallback } from "react";
import { Background, Controls, MiniMap, Panel, ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Toolbar from "../../components/Toolbar";

const initialNodes = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];

const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2", label:"connects with"}];

export default function Charts() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((ns) => applyNodeChanges(changes, ns)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((es) => applyEdgeChanges(changes, es)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((es) => addEdge(params, es)),
    []
  );

  return (
    <div className="w-[1200px] h-screen bg-white rounded-xl shadow-md p-4">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
            <Controls/>
            <Background color="purple"/>
            <MiniMap 
                variant="dots" 
                gap={12} 
                size={1}/>
            <Panel position="top-right">
                <PanelCustom/>
            </Panel>
         </ReactFlow>
      <p></p>
    </div>
  );
}

function PanelCustom(){
    return(
        <div>
            <Toolbar/>
        </div>
    )
};

// save and restore
// adicionar node
// baixar image
// excluir edges
// modificar texto da edge