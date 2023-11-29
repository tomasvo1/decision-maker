import classnames from 'classnames';


export function Divider({ className }: { className?: string }) {
  return (
    <div className={classnames('divider', className)} />
  );
}
