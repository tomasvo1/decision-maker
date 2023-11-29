import { IconButton, Tooltip } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'


interface EditIconButtonProps {
  onClick: () => void;
}


export function EditIconButton({ onClick }: EditIconButtonProps) {
  return (
    <Tooltip placement="top" title="Edit">
      <span>
        <IconButton
          sx={{ height: '40px', width: '40px' }}
          onClick={(e) => {
            e?.preventDefault()
            onClick()
          }}
        >
          <EditOutlinedIcon sx={{ fill: '#0038ff' }} />
        </IconButton>
      </span>
    </Tooltip>
  )
}