import IntrinsicElements = React.JSX.IntrinsicElements;
import classNames from "classnames";
import * as React from "react";

type NumberAttr = number | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
type ColOrderNumber = number | '1' | '2' | '3' | '4' | '5';
type ColOrder = ColOrderNumber | 'first' | 'last';
type ColSize = boolean | 'auto' | NumberAttr;
type ColSpec = ColSize | {
  span?: ColSize;
  offset?: NumberAttr;
  order?: ColOrder;
};

export type ColProps = IntrinsicElements["div"] & {
  xs?: ColSpec;
  sm?: ColSpec;
  md?: ColSpec;
  lg?: ColSpec;
  xl?: ColSpec;
  xxl?: ColSpec;
};

export default function Col({className, children, ...otherProps}: ColProps) {
  return (
    <div className={classNames("col", className)} {...otherProps}>
      {children}
    </div>
  )
}
