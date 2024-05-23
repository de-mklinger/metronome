import {UIEvent, PointerEvent, useState} from 'react';

import KnobSvg from '../../images/knob.svg';
import KnobOverlay from '../../images/knob-overlay.svg';
import isPlainOldObject from "../../lib/is-plain-old-object.ts";

//const ToRad = Math.PI / 180;
const ToDeg = 180 / Math.PI;

export type KnobProps = {
    rotation: number,
    minRotation: number,
    maxRotation: number,
    onRotate: (newRotation: number) => void
}

function isElement(x: unknown): x is Element {
    return isPlainOldObject(x)
        && x.nodeType === Node.ELEMENT_NODE;
}

function getTargetElement(e: UIEvent): Element | undefined {
    if (isElement(e.target)) {
        return e.target;
    } else {
        return undefined;
    }
}

function requireTargetElement(e: UIEvent): Element {
    const el = getTargetElement(e);
    if (!el) {
        throw new Error(`Expected element event target for event: ${e}`);
    }
    return el;
}

type CoordinatesHolder = {
    clientX: number,
    clientY: number
}

function isCoordinatesHolder(x: unknown): x is CoordinatesHolder {
  return (
    isPlainOldObject(x) &&
    typeof x.clientX === "number" &&
    typeof x.clientY === "number"
  );
}

function isTouchList(x: unknown): x is TouchList {
    return (
      typeof x === "object" &&
      x !== null &&
      "length" in x &&
      typeof x.length === "number" &&
      "item" in x &&
      typeof x.item === "function"
    );
}

function Knob({rotation, minRotation, maxRotation, onRotate}: KnobProps) {
    const [currentRotation, setCurrentRotation] = useState(rotation);
    const [dragStartDegreeInUnit, setDragStartDegreeInUnit] = useState(0);
    const [quadrant, setQuadrant] = useState(0);
    const [mouseDragInProgress, setMouseDragInProgress] = useState(false);

    function pointerDown(e: PointerEvent) {
        setMouseDragInProgress(true);
        if (isElement(e.target)) {
            e.target.setPointerCapture(e.pointerId);
        }
        touchStart(e);
    }

    function pointerUp(e: PointerEvent) {
        if (isElement(e.target)) {
            e.target.releasePointerCapture(e.pointerId);
        }
        setMouseDragInProgress(false);
    }

    function pointerMove(e: PointerEvent) {
        if (mouseDragInProgress) {
            touchMove(e);
        }
    }

    function touchStart(e: UIEvent) {
        const centerRelativeCoordinates = getCenterRelativeCoordinates(e);
        const dragStartDegreeInUnit = Math.atan2(centerRelativeCoordinates.y, centerRelativeCoordinates.x) * ToDeg;

        setDragStartDegreeInUnit(dragStartDegreeInUnit);
        setQuadrant(getQuadrantFromDegreeInUnit(dragStartDegreeInUnit));
    }

    function touchMove(e: UIEvent) {
        const oldRotation = currentRotation;
        const oldQuadrant = quadrant;

        const centerRelativeCoordinates = getCenterRelativeCoordinates(e);
        const dragMoveDegreeInUnit = Math.atan2(centerRelativeCoordinates.y, centerRelativeCoordinates.x) * ToDeg;
        let diffRotation = dragMoveDegreeInUnit - dragStartDegreeInUnit;

        const newQuadrant = getQuadrantFromDegreeInUnit(dragMoveDegreeInUnit);

        if (oldQuadrant === 3 && newQuadrant === 2) {
            diffRotation = 360 + diffRotation;
        } else if (oldQuadrant === 2 && newQuadrant === 3) {
            diffRotation = 360 - diffRotation;
        }

        let newRotation = oldRotation + diffRotation;

        if (minRotation !== undefined && newRotation < minRotation) {
            newRotation = minRotation;
        }

        if (maxRotation !== undefined && newRotation > maxRotation) {
            newRotation = maxRotation;
        }

        setDragStartDegreeInUnit(dragMoveDegreeInUnit);
        setCurrentRotation(newRotation);
        setQuadrant(newQuadrant);

        if (onRotate) {
            onRotate(newRotation);
        }
    }

    function getCenterRelativeCoordinates(e: UIEvent) {
        const element = requireTargetElement(e);
        const rect = element.getBoundingClientRect();

        let coordinatesHolder: CoordinatesHolder;
        if ("targetTouches" in e && isTouchList(e.targetTouches) && e.targetTouches.length > 0) {
            coordinatesHolder = e.targetTouches.item(0)!;
        } else if (isCoordinatesHolder(e)) {
            coordinatesHolder = e;
        } else {
            console.warn("Unable to find client coordinates in UI event:", e);
            coordinatesHolder = {
                clientX: 0,
                clientY: 0
            }
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
    function getQuadrantFromDegreeInUnit(degreeInUnit: number): 1 | 2 | 3 | 4 {
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
        throw new Error("Illegal Argument: Expected -90 <= degreeInUnit <= 90 but was: " + degreeInUnit);
    }

    return (
        <div className="speed-knob" style={{position: "relative"}}>
            <div
                onTouchStart={touchStart}
                onTouchMove={touchMove}
                onPointerDown={pointerDown}
                onPointerMove={pointerMove}
                onPointerUp={pointerUp}
                style={{
                    touchAction: "none",
                    // flexGrow: 4,
                    transform: "rotate(" + currentRotation + "deg)",
                    backgroundImage: `url(${KnobSvg})`,
                    backgroundSize: "contain",
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%"
                }}>
            </div>
            <img src={KnobOverlay} alt="" style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                zIndex: 100,
                opacity: 0.75,
                pointerEvents: "none"
            }}/>
        </div>
    );
}

export default Knob;
