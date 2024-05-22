import IntrinsicElements = React.JSX.IntrinsicElements;

export type FormGroupProps = IntrinsicElements["div"];

export default function FormGroup({children, ...otherProps}: FormGroupProps) {
  return (
    <div {...otherProps}>
      {children}
    </div>
  )
}
