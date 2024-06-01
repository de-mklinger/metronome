import Logo from "../images/logo.svg?react";
import { PropsWithChildren, useState } from "react";
import { useAppState } from "../lib/use-app-state.ts";
import { getAudioContext } from "../lib/audio.ts";
import Div100vh from "react-div-100vh";
import { FormattedMessage } from "react-intl";

export default function SplashScreen({ children }: PropsWithChildren) {
  const appState = useAppState();
  const isAudioContextRunning = () => getAudioContext().state === "running";
  const [visible, setVisible] = useState(
    !isAudioContextRunning() || appState.config.splashAlways,
  );

  function close() {
    setVisible(false);
  }

  if (!visible) {
    return <>{children}</>;
  }

  return (
    <Div100vh
      className="splash-screen"
      onClick={close}
      onKeyDown={close}
      autoFocus={true}
    >
      <div>
        <h1>
          <FormattedMessage id="splash.heading" />
        </h1>
      </div>
      <div className="logo">
        <Logo />
      </div>
      <div>
        <div>
          <FormattedMessage id="splash.line1" />
        </div>
        <div>
          <FormattedMessage id="splash.line2" />
        </div>
        <div>
          <FormattedMessage id="splash.line3" />
        </div>
      </div>
      <div style={{ width: "0px", height: "0px", overflow: "hidden" }}>
        <input type="text" autoFocus={true} />
      </div>
    </Div100vh>
  );
}
