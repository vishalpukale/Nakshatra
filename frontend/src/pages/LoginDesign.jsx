import React, { version } from "react";
import { useNavigate } from "react-router-dom";
// import { Card, Avatar } from 'ui-controls';
import { Avatar, Card } from "../ui-controls";
import outlineCircle from "../assets/images/login-Ellipse-1.svg";
import fillCircle from "../assets/images/login-Ellipse-2.svg";
import LogoLogin from "../assets/images/app_logo.png";
const LoginDesign = () => {
  const navigate = useNavigate();
  const onLoginClick = (e) => {
    e.preventDefault();
    // alert("Login Successful");
  };
  return (
    <div className="md:container md:mx-auto flex justify-center items-center h-screen">
      <div className="w-352 relative z-10">
        <Card cardStyle="h-hp-352 rounded-md login-bx-shadow text-center flex justify-center">
          <div className="login-top-ellpsis">
            <img alt="" src={outlineCircle} />
          </div>
          <div className="login-bottom-ellpsis">
            <img alt="" src={fillCircle} />
          </div>
          <div className="copyright-text">&copy; MargMaker</div>
          <Avatar
            size="md"
            title="logo"
            isRounded={false}
            src={LogoLogin}
            imgStyle="mt-0 p-1 w-72 h-auto"
            btnStyle="m-auto mt-mtp-52"
          />

          {/* <h3 className="text-lg leading-6 font-medium mt-5 mb-10  pb-4 text-color-text">
            Payment Intelligence 2.0
          </h3> */}

          <button
            type="button"
            className="items-center bg-primary-accent px-7 mt-20 h-8 w-wp-272 pt-3px pb-1.5 rounded text-base text-white cursor-pointer focus:outline-none border-primary-accent hover:bg-orange-300"
            onClick={onLoginClick}
          >
            Login
          </button>
        </Card>
      </div>
    </div>
  );
};

export default LoginDesign;
