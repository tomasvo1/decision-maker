import { Button as MButton, ButtonProps as MButtonProps } from '@mui/material'
import classnames from 'classnames'


interface ButtonProps extends MButtonProps {
  danger?: boolean;
}


export function Button({
  variant = 'contained',
  className,
  children,
  danger,
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <MButton
      variant={variant}
      className={classnames('button',
        `button--${variant}`,
        { 'button--danger': danger },
        className,
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </MButton>
  )
}
