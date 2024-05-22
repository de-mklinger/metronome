import IntrinsicElements = React.JSX.IntrinsicElements;
import classNames from "classnames";

export type RowProps = IntrinsicElements["div"];

export default function Row({className, children, ...otherProps}: RowProps) {
  return (
    <div className={classNames("row", className)} {...otherProps}>
      {children}
    </div>
  )
}
