import React, { ReactNode } from 'react'

import { Handle, Position } from 'reactflow'

import { Divider } from '../../../Components'

import { DeleteIconButton, EditIconButton } from '../Shared'


interface BaseNodeProps {
  id: string;
  name: string;
  showTopHandle?: boolean;
  showBottomHandle?: boolean;
  children: ReactNode;
  onEdit: (id: string) => void;
  onDelete: (id?: string) => void;
}


function BaseNode({
  id,
  name,
  showTopHandle = false,
  showBottomHandle = false,
  children,
  onEdit,
  onDelete,
}: BaseNodeProps) {
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
            <EditIconButton onClick={() => onEdit(id)} />
            <DeleteIconButton onClick={() => onDelete(id)} />
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
