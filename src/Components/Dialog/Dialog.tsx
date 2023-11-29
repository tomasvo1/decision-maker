import React from 'react'

import classnames from 'classnames'
import { DialogTitle, DialogContent, DialogActions, Dialog as MDialog } from '@mui/material'

import { Button } from '../Button/Button'


interface DialogProps {
  open: boolean;
  title: string;
  children?: React.ReactNode;
  submitDisabled?: boolean;
  className?: string;
  deleteMode?: boolean;
  onSubmit: () => void;
  onClose: () => void;
}


export function Dialog({
  open,
  title,
  children,
  submitDisabled,
  className,
  deleteMode,
  onSubmit,
  onClose,
}: DialogProps) {
  return (
    <MDialog
      open={open}
      onClose={onClose}
      classes={{
        paper: classnames('dialog', className),
      }}
    >
      <DialogTitle classes={{ root: 'dialog__title' }}>
        <span>{title}</span>
      </DialogTitle>

      {children && (
        <DialogContent classes={{ root: 'dialog__content' }}>
          {children}
        </DialogContent>
      )}

      <DialogActions classes={{ root: 'dialog__actions' }}>
        <Button
          onClick={onSubmit}
          disabled={submitDisabled}
          danger={deleteMode}
        >
          {!deleteMode ? 'Submit' :'Delete'}
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </MDialog>
  )
}