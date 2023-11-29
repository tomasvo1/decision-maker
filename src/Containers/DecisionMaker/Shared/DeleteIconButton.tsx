import { IconButton, Tooltip } from '@mui/material'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'


interface DeleteIconButtonProps {
  disabled?: boolean;
  onClick: () => void;
}


export function DeleteIconButton({ disabled = false, onClick }: DeleteIconButtonProps) {
  return (
    <Tooltip placement="top" title="Delete">
      <span>
        <IconButton
          sx={{ height: '40px', width: '40px' }}
          disabled={disabled}
          onClick={(e) => {
            e?.preventDefault()
            onClick()
          }}
        >
          <DeleteOutlineOutlinedIcon sx={{ fill: disabled ? '#8A817C' : '#ff004e' }} />
        </IconButton>
      </span>
    </Tooltip>
  )
}