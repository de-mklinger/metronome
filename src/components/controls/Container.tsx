import IntrinsicElements = React.JSX.IntrinsicElements;
import classNames from "classnames";

export type ContainerProps = IntrinsicElements["div"];

export default function Container({className, children, ...otherProps}: ContainerProps) {
  return (
    <div className={classNames("container", className)} {...otherProps}>
      {children}
    </div>
  )
}
