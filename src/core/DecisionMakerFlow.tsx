import React, { useEffect } from 'react'
import ReactFlow, { useNodesState, useEdgesState, Edge, Node, NodeTypes as INodeTypes } from 'reactflow'

import { AttributeNode, OptionNode, WinnerNode } from '../Containers/DecisionMaker/Nodes'
import { NodeTypes } from '../Containers/DecisionMaker/enums'

import 'reactflow/dist/style.css'


const NODE_TYPES: INodeTypes = {
  [NodeTypes.attributes as string]: AttributeNode,
  [NodeTypes.options as string]: OptionNode,
  [NodeTypes.winner as string]: WinnerNode,
}


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
      maxZoom={1}
      fitView
    />
  )
}


export default React.memo(DecisionMakerFlow)
