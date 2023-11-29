import React from 'react'

import { Handle, Position } from 'reactflow'
import classnames from 'classnames'

import { Divider } from '../../../Components'
import { useAttributes, useOptions } from '../../../Contexts'

import { DeleteIconButton, EditIconButton } from '../Shared'
import { IAttributeNode, IOptionNode } from '../types'
import { NodeTypes } from '../enums'


// NOTE: If you type props with reactflow's Node interface, nodeTypes in <ReactFlow /> component throw a warning
function Node(props) {
  const { onAttributeEdit, onAttributeDelete } = useAttributes()
  const { onOptionEdit, onOptionDelete } = useOptions()

  const { name, id, type } = props.data

  function onEditClick() {
    if (type === NodeTypes.attributes) {
      onAttributeEdit(id)
      return
    }
    onOptionEdit(id)
  }

  function onDeleteClick() {
    if (type === NodeTypes.attributes) {
      onAttributeDelete(id)
      return
    }
    onOptionDelete(id)
  }

  return (
    <>
      {[NodeTypes.options, NodeTypes.winner].includes(type) && (
        <Handle type="target" position={Position.Top} isConnectable={false} />
      )}
      <div className={classnames('base-node', {
        'base-node--winner': type === NodeTypes.winner,
      })}>
        {type === NodeTypes.winner ? (
          <>
            <span className="base-node__name--large">
              {name}
            </span>
            <span className="base-node__winner-score">
              {(props.data as IOptionNode).totalScore}
            </span>
          </>
        ) : (
          <>
            <div className="base-node__header">
              <span className="base-node__name">
                {name}
              </span>

              <div className="base-node__button-group">
                <EditIconButton onClick={onEditClick} />
                <DeleteIconButton onClick={onDeleteClick} />
              </div>
            </div>

            {type === NodeTypes.attributes && (
              <b>Weight: {(props.data as IAttributeNode).weight}</b>
            )}

            {type === NodeTypes.options && (
              <>
                <div className="option-node__divider-container">
                  <Divider />
                </div>
                <ul className="option-node__attributes-list">
                  {Object.entries((props.data as IOptionNode).attributes).map(([id, attribute]) => (
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
                  <span className="gradient-text">{(props.data as IOptionNode).totalScore}</span>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {type !== NodeTypes.winner && (
        <Handle type="source" position={Position.Bottom} isConnectable={false} />
      )}
    </>
  )
}

export default React.memo(Node)
