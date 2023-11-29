import React, { ReactNode } from 'react'

import { Handle, Position } from 'reactflow'

import { Divider } from '../../../Components'
import { useAttributes, useOptions } from '../../../Contexts'

import { DeleteIconButton, EditIconButton } from '../Shared'
import { NodeTypes } from '../enums'


interface BaseNodeProps {
  id: string;
  type: NodeTypes;
  name: string;
  showTopHandle?: boolean;
  showBottomHandle?: boolean;
  children: ReactNode;
}


function BaseNode({
  id,
  type,
  name,
  showTopHandle = false,
  showBottomHandle = false,
  children,
}: BaseNodeProps) {
  const { onAttributeEdit, onAttributeDelete } = useAttributes()
  const { onOptionEdit, onOptionDelete } = useOptions()

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
      {showTopHandle && (
        <Handle type="target" position={Position.Top} isConnectable={false} />
      )}
      <div className="base-node">
        <div className="base-node__header">
          <span className="base-node__name">
            {name}
          </span>

          <div className="base-node__button-group">
            <EditIconButton onClick={onEditClick} />
            <DeleteIconButton onClick={onDeleteClick} />
          </div>
        </div>

        <div className="option-node__divider-container">
          <Divider />
        </div>

        {children}

      </div>
      {showBottomHandle && (
        <Handle type="source" position={Position.Bottom} isConnectable={false} />
      )}
    </>
  )
}

export default React.memo(BaseNode)
