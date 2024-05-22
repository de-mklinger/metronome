import IntrinsicElements = React.JSX.IntrinsicElements;
import classNames from "classnames";

export type FormGroupProps = IntrinsicElements["div"];

export default function FormGroup({className, children, ...otherProps}: FormGroupProps) {
  return (
    <div className={classNames("form-group", className)} {...otherProps}>
      {children}
    </div>
  )
}
