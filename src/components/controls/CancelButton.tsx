import { Link, useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import Button from "./Button.tsx";

export type CancelButtonProps = {
  back?: number | string | (() => void);
};

export default function CancelButton({ back = -1 }: CancelButtonProps) {
  const navigate = useNavigate();

  if (typeof back === "string") {
    return (
      <Link to={back} className="btn btn-link">
        <FormattedMessage id="cancel" />
      </Link>
    );
  }

  const handleClick = typeof back === "function" ? back : () => navigate(back);

  return (
    <Button variant="link" onClick={handleClick}>
      <FormattedMessage id="cancel" />
    </Button>
  );
}
