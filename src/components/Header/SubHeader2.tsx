"use client";

import React, { FC, useRef, useState, useEffect } from "react";
import SubMainNav1 from "./SubMainNav1";
import { usePathname } from 'next/navigation'

export interface HeaderProps {}

let MAIN_MENU_HEIGHT = 0;
let WIN_PREV_POSITION:any = typeof window !== "undefined" && window?.pageYOffset;

const Header: FC<HeaderProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainMenuRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const showSingleMenu = pathname.search(/^\/posts/g) > -1;

  const [isSingleHeaderShowing, setIsSingleHeaderShowing] = useState(false);

  useEffect(() => {
    if (!mainMenuRef.current) {
      return;
    }
    MAIN_MENU_HEIGHT = mainMenuRef.current.offsetHeight;
    window?.addEventListener("scroll", handleShowHideHeaderMenuEvent);
    return () => {
      window?.removeEventListener("scroll", handleShowHideHeaderMenuEvent);
    };
  }, []);

  useEffect(() => {
    if (showSingleMenu) {
      //  BECAUSE DIV HAVE TRANSITION 100ms
      setTimeout(() => {
        window?.addEventListener("scroll", handleShowHideSingleHeadeEvent);
      }, 200);
    } else {
      window?.removeEventListener("scroll", handleShowHideSingleHeadeEvent);
    }
    return () => {
      window?.removeEventListener("scroll", handleShowHideSingleHeadeEvent);
    };
  }, [showSingleMenu]);

  const handleShowHideSingleHeadeEvent = () => {
    window?.requestAnimationFrame(showHideSingleHeade);
  };

  const handleShowHideHeaderMenuEvent = () => {
    window?.requestAnimationFrame(showHideHeaderMenu);
  };

  const handleProgressIndicator = () => {
    const entryContent = document.querySelector(
      "#single-entry-content"
    ) as HTMLDivElement | null;

    if (!showSingleMenu || !entryContent) {
      return;
    }

    const totalEntryH = entryContent.offsetTop + entryContent.offsetHeight+700;

    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;

    let scrolled = (winScroll / totalEntryH) * 100;

    if (!progressBarRef.current || scrolled > 140) {
      return;
    }

    scrolled = scrolled >= 100 ? 100 : scrolled;

    progressBarRef.current.style.width = scrolled + "%";
  };

  const showHideSingleHeade = () => {
    handleProgressIndicator();
    // SHOW _ HIDE SINGLE DESC MENU
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > 600) {
      setIsSingleHeaderShowing(true);
    } else {
      setIsSingleHeaderShowing(false);
    }
  };

  const showHideHeaderMenu = () => {
    let currentScrollPos = window?.pageYOffset;
    if (!containerRef.current || !mainMenuRef.current) return;

    if (Math.abs(WIN_PREV_POSITION - currentScrollPos) <= 50) {
      return;
    }

    // SHOW _ HIDE MAIN MENU
    if (WIN_PREV_POSITION > currentScrollPos) {
      containerRef.current.style.top = "0";
    } else {
      containerRef.current.style.top = `-${MAIN_MENU_HEIGHT + 2}px`;
    }

    WIN_PREV_POSITION = currentScrollPos;
  };

  const renderSingleHeader = () => {
    if (!isSingleHeaderShowing) return null;
    return (
      <div className="nc-SingleHeaderMenu">
        <div className="absolute top-full left-0 w-full progress-container h-[5px] bg-neutral-300 overflow-hidden">
          <div
            ref={progressBarRef}
            className="progress-bar h-[5px] w-0 bg-primary-600"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="nc-Header sticky top-0 w-full z-40">
      <SubMainNav1 />
      {showSingleMenu && renderSingleHeader()}
    </div>
  );
};

export default Header;
