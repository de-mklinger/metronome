import React from 'react';

const ToRad = Math.PI / 180;
const ToDeg = 180 / Math.PI;

class SpeedKnob extends React.Component {
    constructor(props) {
        super(props);
        this.onRotate = props.onRotate;
        this.state = {
            rotation: props.rotation,
            dragStartDegreeInUnit: 0,
            quadrant: 0
        };
    }

    render() {
        return (
                <div
                    onTouchStart={this.touchStart.bind(this)}
                    onTouchMove={this.touchMove.bind(this)}
                    style={{
                        // flexGrow: 4,
                        border: "1px solid white",
                        width: "50%",
                        paddingBottom: "50%",
                        transform: "rotate(" + this.state.rotation + "deg)",
                    }}>
                </div>
        )
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
        }

        const newRotation = oldRotation + diffRotation;

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
        // if (JogDial.MobileEvent) {
        coordinatesHolder = e.targetTouches[0];
        // } else {
        //     coordinatesHolder = e;
        // }

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