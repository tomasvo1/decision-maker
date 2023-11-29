import React from 'react'
import { Node } from 'reactflow'

import { IAttributeNode } from '../types'
import BaseNode from './BaseNode'


function AttributeNode(props: Node<IAttributeNode>) {
  const { name, id, type, weight } = props.data

  return (
    <BaseNode
      id={id}
      type={type}
      name={name}
      showBottomHandle
    >
      <b>Weight: {weight}</b>
    </BaseNode>
  )
}

export default React.memo(AttributeNode)