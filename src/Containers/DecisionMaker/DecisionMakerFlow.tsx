import React, { useEffect } from 'react'
import ReactFlow, { useNodesState, useEdgesState, Edge, Node } from 'reactflow'

import CustomNode from './Nodes'


const NODE_TYPES = { customNode: CustomNode }


interface DecisionMakerFlowProps {
  calculatedNodes: Node[];
  calculatedEdges: Edge[];
}

function DecisionMakerFlow({ calculatedNodes, calculatedEdges }: DecisionMakerFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(calculatedNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(calculatedEdges)

  useEffect(() => {
    setNodes(calculatedNodes)
  }, [calculatedNodes, setNodes])

  useEffect(() => {
    setEdges(calculatedEdges)
  }, [calculatedEdges, setEdges])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={NODE_TYPES}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    />
  )
}


export default React.memo(DecisionMakerFlow)
