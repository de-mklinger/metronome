import {ReactComponent as Logo} from "../images/logo-green.svg";

function LoadingIndicator() {
    return (
        <div className="loading-indicator">
            <div className="logo">
                <Logo />
            </div>
        </div>
    );
}

export default LoadingIndicator;