export type BeatProps = {
  accent: boolean;
  active: boolean;
}

function Beat(props: BeatProps) {
    let className = 'beat';
    if (props.accent) {
        className += ' accent';
    }
    if (props.active) {
        className += ' active';
    }
    return (
        <div className={className}>
            <div className="beat-item beat-upper"/>
            <div className="beat-item beat-middle"/>
            <div className="beat-item beat-lower"/>
        </div>
    );
}

export default Beat
