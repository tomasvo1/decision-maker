import React from 'react'

import { Divider } from '../../../Components'

import { IOptionNode } from '../types'

import BaseNode from './BaseNode'


function OptionNode(props: { data: IOptionNode }) {
  const { name, id, attributes, totalScore, onOptionDelete, onOptionEdit } = props.data

  return (
    <BaseNode
      id={id}
      name={name}
      showBottomHandle
      showTopHandle
      onDelete={onOptionDelete}
      onEdit={onOptionEdit}
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
