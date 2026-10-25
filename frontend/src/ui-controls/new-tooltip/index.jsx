import React, { useRef, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

const TruncatedTooltipCell = ({
    value = "",
    rowId = "",
    maxLength = 30, // This becomes irrelevant with CSS approach
    tooltipIdPrefix = "",
    subLabel = "",
    showSubLabel = false,
    direction = "bottom",
    tooltipComponent: TooltipWrapper = Tooltip,
    className = "text-sm",
}) => {
    const textRef = useRef(null);
    const [isTruncated, setIsTruncated] = useState(false);
    const tooltipId = `${tooltipIdPrefix}-${rowId}`;

    useEffect(() => {
        const element = textRef.current;
        if (element) {
            // Check if the text is truncated by comparing scrollWidth with clientWidth
            setIsTruncated(element.scrollWidth > element.clientWidth);
        }
    }, [value]);

    return (
        <div className="flex flex-col w-full break-words max-w-[100px] min-w-0">
            <span
                ref={textRef}
                data-tooltip-id={isTruncated ? tooltipId : undefined}
                data-tooltip-content={isTruncated ? value : undefined}
                data-tooltip-place={direction}
                className={` ${className}`}
            >
                {value}
            </span>

            {isTruncated && (
                <TooltipWrapper id={tooltipId} positionStrategy="fixed" />
            )}

            {showSubLabel && (
                <span className="text-gray-500 truncate text-xs">{subLabel}</span>
            )}
        </div>
    );
};

export default TruncatedTooltipCell;