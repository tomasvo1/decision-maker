import React from 'react'

import { IAttributeNode } from '../types'

import BaseNode from './BaseNode'


function AttributeNode(props: { data: IAttributeNode }) {
  const { name, id, weight, onAttributeDelete, onAttributeEdit } = props.data

  return (
    <BaseNode
      id={id}
      name={name}
      showBottomHandle
      onDelete={onAttributeDelete}
      onEdit={onAttributeEdit}
    >
      <b>Weight: {weight}</b>
    </BaseNode>
  )
}

export default React.memo(AttributeNode)
