import React, { FC } from "react";
import { CheckIcon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
  
export interface SocialsListProps {
    className?: string;
    itemClass?: string;
    socials?: any;
}
  
const SubSocialsList: FC<SocialsListProps> = ({
    className = "",
    itemClass = "block",
    socials,
}) => {
    
    const getIconVal = (name: any) => {
        switch(name) {
            case "Facebook":
                return "lab la-facebook-f";
            case "Twitter":
                return "lab la-twitter";
            case "YouTube":
                return "lab la-youtube";
            case "Instagram":
                return "lab la-instagram";
            default:
                return "";    
        }
    }

    return (
        <nav
            className={`nc-SocialsList flex space-x-2.5 text-2xl text-neutral-6000 dark:text-neutral-300 ${className}`}
            data-nc-id="SocialsList"
        >
            {socials.map((item:any, i:any) => item.link !== "" && (
                <a
                    key={i}
                    className={`${itemClass}`}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.name}
                >
                    <i className={getIconVal(item.name)}></i>
                </a>
            ))}
        </nav>
    );
  };
  
  export default SubSocialsList;
  