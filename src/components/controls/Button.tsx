import classNames from "classnames";
import IntrinsicElements = React.JSX.IntrinsicElements;

export type ButtonProps = {
  variant?: "primary" | "secondary" | "link";
} & IntrinsicElements["button"];

export default function Button({variant = "primary", className, children, ...otherProps}: ButtonProps) {
  return (
    <button className={classNames("btn", `btn-${variant}`, className)} {...otherProps}>
      {children}
    </button>
  )
}
