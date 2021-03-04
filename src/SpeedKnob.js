import React from 'react';

import KnobSvg from './images/knob.svg';
import KnobOverlay from './images/knob-overlay.svg';

//const ToRad = Math.PI / 180;
const ToDeg = 180 / Math.PI;

class SpeedKnob extends React.Component {
    constructor(props) {
        super(props);
        this.onRotate = props.onRotate;
        this.state = {
            rotation: props.rotation,
            dragStartDegreeInUnit: 0,
            quadrant: 0,
            mouseDragInProgress: false
        };
    }

    render() {
        return (
            <div style={{
                position: "relative",
                width: "50%",
                paddingBottom: "50%",
            }}>
                <div
                    onTouchStart={this.touchStart.bind(this)}
                    onTouchMove={this.touchMove.bind(this)}
                    onPointerDown={this.pointerDown.bind(this)}
                    onPointerMove={this.pointerMove.bind(this)}
                    onPointerUp={this.pointerUp.bind(this)}
                    style={{
                        touchAction: "none",
                        // flexGrow: 4,
                        transform: "rotate(" + this.state.rotation + "deg)",
                        backgroundImage: `url(${KnobSvg})`,
                        backgroundSize: "contain",
                        position: "absolute",
                        width: "100%",
                        height: "100%"
                    }}>
                </div>
                <img src={KnobOverlay} alt="" style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    zIndex: 100,
                    opacity: 0.75,
                    pointerEvents: "none"
                }}/>
            </div>
        )
    }

    pointerDown(e) {
        this.setState({
            mouseDragInProgress: true
        });
        e.target.setPointerCapture(e.pointerId);
        this.touchStart(e);
    }

    pointerUp(e) {
        e.target.releasePointerCapture(e.pointerId);
        this.setState({
            mouseDragInProgress: false
        })
    }

    pointerMove(e) {
        if (this.state.mouseDragInProgress) {
            this.touchMove(e);
        }
    }

    touchStart(e) {
        const centerRelativeCoordinates = this.getCenterRelativeCoordinates(e);
        const dragStartDegreeInUnit = Math.atan2(centerRelativeCoordinates.y, centerRelativeCoordinates.x) * ToDeg;

        this.setState({
            dragStartDegreeInUnit: dragStartDegreeInUnit,
            quadrant: this.getQuadrantFromDegreeInUnit(dragStartDegreeInUnit)
        });
    }

    touchMove(e) {
        const oldRotation = this.state.rotation;
        const oldQuadrant = this.state.quadrant;

        const centerRelativeCoordinates = this.getCenterRelativeCoordinates(e);
        const dragMoveDegreeInUnit = Math.atan2(centerRelativeCoordinates.y, centerRelativeCoordinates.x) * ToDeg;
        let diffRotation = dragMoveDegreeInUnit - this.state.dragStartDegreeInUnit;

        const newQuadrant = this.getQuadrantFromDegreeInUnit(dragMoveDegreeInUnit);

        if (oldQuadrant === 3 && newQuadrant === 2) {
            diffRotation = 360 + diffRotation;
        } else if (oldQuadrant === 2 && newQuadrant === 3) {
            diffRotation = 360 - diffRotation;
        }

        let newRotation = oldRotation + diffRotation;

        if (this.props.minRotation !== undefined && newRotation < this.props.minRotation) {
            newRotation = this.props.minRotation;
        }

        if (this.props.maxRotation !== undefined && newRotation > this.props.maxRotation) {
            newRotation = this.props.maxRotation;
        }

        this.setState({
            dragStartDegreeInUnit: dragMoveDegreeInUnit,
            rotation: newRotation,
            quadrant: newQuadrant
        });

        if (this.onRotate) {
            this.onRotate(newRotation);
        }
    }

    getCenterRelativeCoordinates(e) {
        const element = e.target;
        const rect = element.getBoundingClientRect();

        let coordinatesHolder;
        if (e.targetTouches) {
            coordinatesHolder = e.targetTouches[0];
        } else {
            coordinatesHolder = e;
        }

        return {
            x: coordinatesHolder.clientX - rect.left - rect.width / 2,
            y: coordinatesHolder.clientY - rect.top - rect.height / 2
        };
    }

    // Quadrants:
    //
    // +-----+-----+
    // |  2  |  1  |
    // +-----+-----+
    // |  3  |  4  |
    // +-----+-----+
    getQuadrantFromDegreeInUnit(degreeInUnit) {
        //console.log("degreeInUnit", degreeInUnit)
        if (degreeInUnit >= 0 && degreeInUnit < 90) {
            return 4;
        }
        if (degreeInUnit >= 90) {
            return 3;
        }
        if (degreeInUnit < -90) {
            return 2;
        }
        if (degreeInUnit >= -90 && degreeInUnit < 0) {
            return 1;
        }
    }
}

export default SpeedKnob;