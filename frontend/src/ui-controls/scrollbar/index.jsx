import React from "react";
// import './style.css';
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PropTypes from "prop-types";

const ScrollBar = ({
  sbRef,
  scrollStyle,
  autoHeightMin,
  autoHeightMax,
  children,
  maxHeight,
  maxWidth,
  horizontal,
  verticle,
  autohide,
  ...rest
}) => {
  return (
    <>
      <OverlayScrollbarsComponent
        ref={sbRef}
        options={{
          scrollbars: { autoHide: autohide },
          overflowBehavior: { x: horizontal, y: verticle },
        }}
        style={{
          maxHeight: maxHeight,
          maxWidth: maxWidth,
        }}
        className={scrollStyle}
        {...rest}
      >
        {children}
      </OverlayScrollbarsComponent>
    </>
  );
};

ScrollBar.propTypes = {
  children: PropTypes.node.isRequired,
  scrollStyle: PropTypes.string,
  verticle: PropTypes.string,
  horizontal: PropTypes.string,
};
ScrollBar.defaultProps = {
  autohide: "leave",
  verticle: "scroll",
  horizontal: "hidden",
  maxHeight: "100%",
  maxWidth: "100%",
};

export default ScrollBar;
