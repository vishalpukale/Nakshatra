import React from "react";
import { Avatar, Card } from "../index";
import { chatIcon } from "../../assets/index";

const AIChatbotCards = ({ cardData, onCardClick }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {cardData?.map((stat, index) => {
      
              return (
                <Card
                  key={index}
                  cardStyle={"border border-[1px] border-gray-border p-2 hover:cursor-pointer !rounded-xl shadow-lg shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)]"}
                  childStyle="items-center !text-black relative h-full"
                  onClick={() => onCardClick(stat.name)}
                >
                   <div className="grid grid-rows-[auto_1fr] h-full">
                    <div className="py-2 px-1">

                    <Avatar src={chatIcon} imgStyle={"h-[20px] w-[20px]"} isCenter={false}/>
                    </div>

                    <p className="text-txt-md-12">{stat.name}</p>
                  </div>

                </Card>
              );
            })}
    </div>
  );
};

export default AIChatbotCards;
