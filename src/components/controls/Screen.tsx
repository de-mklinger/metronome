import Container, { ContainerProps } from "./Container.tsx";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormattedMessage } from "react-intl";

export type ScreenProps = {
  name: string;
  back?: false | string | number;
} & ContainerProps;

export default function Screen({ children, name, back, className, ...containerProps }: ScreenProps) {
  return (
    <>
      <ScreenNavigation name={name} back={back} />
      <Container className={classNames(`${name}-screen`, className)} {...containerProps}>{children}</Container>
    </>
  );
}

type ScreenNavigationProps = ScreenProps;

function ScreenNavigation({ back, name }: ScreenNavigationProps) {
  if (back === false) {
    return undefined;
  }

  if (!back) {
    back = -1;
  }

  return (
    <div
      className={classNames("screen-navigation", `${name}-screen-navigation`)}
    >
      <Container>
        <BackButton back={back} />
      </Container>
    </div>
  );
}

function BackButton({ back }: { back: string | number }) {
  const navigate = useNavigate();

  if (typeof back === "string") {
    return (
      <Link to={back} className="screen-navigation-link">
        <BackButtonLabel />
      </Link>
    );
  }

  return (
    <a
      className="screen-navigation-link"
      href="#"
      onClick={() => navigate(back)}
    >
      <BackButtonLabel />
    </a>
  );
}

function BackButtonLabel() {
  return (
    <>
      <FontAwesomeIcon icon={faChevronLeft} /> <FormattedMessage id="back" />
    </>
  );
}
