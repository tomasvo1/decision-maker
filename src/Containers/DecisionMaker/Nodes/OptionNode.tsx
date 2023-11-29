import React from 'react'
import { Node } from 'reactflow'

import { Divider } from '../../../Components'

import { IOptionNode } from '../types'

import BaseNode from './BaseNode'


function OptionNode(props: Node<IOptionNode>) {
  const { name, id, type, attributes, totalScore } = props.data

  return (
    <BaseNode
      id={id}
      type={type}
      name={name}
      showBottomHandle
      showTopHandle
    >
      <ul className="option-node__attributes-list">
        {Object.entries(attributes).map(([id, attribute]) => (
          <li key={id}>
            {attribute.name}: <b>{attribute.score}</b>
          </li>
        ))}
      </ul>
      <div className="option-node__divider-container">
        <Divider />
      </div>
      <div></div>
      <div className="option-node__score-container">
        Total score:
        {' '}
        <span className="gradient-text">{totalScore}</span>
      </div>
    </BaseNode>
  )
}

export default React.memo(OptionNode)
