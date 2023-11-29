import React from 'react'
import { Handle, Position } from 'reactflow'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'

import { Divider } from '../../../Components'

import { IOptionNode } from '../types'


function WinnerNode(props: { data: IOptionNode }) {
  const { name, totalScore } = props.data

  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <div className="winner-node">
        <div className="winner-node__header">
          <h3 className="winner-node__title">Winner</h3>
          <EmojiEventsOutlinedIcon />
        </div>

        <Divider />

        <div className="winner-node__lower-container">
          <h2 className="winner-node__name">{name}</h2>
          <span className="winner-node__score">
            {totalScore}
          </span>
        </div>

      </div>
    </>
  )
}

export default React.memo(WinnerNode)
