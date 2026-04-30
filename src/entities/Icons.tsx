import { FaRightLong, FaLeftLong, FaUpLong, FaDownLong, FaSink } from "react-icons/fa6";
import { GiMiner, GiCardExchange } from "react-icons/gi";
import { BsMinecartLoaded } from "react-icons/bs";
import { BsSafe2 } from "react-icons/bs";
import { TiArrowMove, TiCancel, TiDelete } from "react-icons/ti";
import { getInvertedDirection, type DirectionType } from "./EntitiesTypes";
import { PiArrowClockwiseBold, PiArrowCounterClockwiseBold } from "react-icons/pi";
import { HiArrowTurnDownLeft, HiArrowTurnDownRight, HiArrowTurnLeftDown, HiArrowTurnLeftUp, HiArrowTurnRightDown, HiArrowTurnRightUp, HiArrowTurnUpLeft, HiArrowTurnUpRight } from "react-icons/hi2";
import type { JSX } from "react";
import { IoIosGitMerge, IoIosArrowBack, IoIosArrowDown, IoIosArrowForward, IoIosArrowUp } from "react-icons/io";
import { FiScissors } from "react-icons/fi";
import { FaBook } from "react-icons/fa";



export const EntityIcons = {
  stock: <BsSafe2 size = "20px" />,
  consumer: <FaSink size={"20px"}/>,
  source: <GiMiner size={"20px"}/>,
  transport: <BsMinecartLoaded size={"20px"}/>,
  splitter: <FiScissors size={"20px"}/>,
  merger: <IoIosGitMerge size={"20px"}/>,
  exchanger:<GiCardExchange size={"20px"}/> ,
  recipe: <FaBook size={"20px"}/>,
  "transport right": <FaRightLong size={"20px"}/>,
  "transport left": <FaLeftLong size={"20px"}/>,
  "transport up": <FaUpLong size={"20px"}/>,
  "transport down": <FaDownLong size={"20px"}/>
};

export const TransportIcons = new Map<string, JSX.Element>([
  ["up-down", <FaDownLong />],
  ["up-left", <HiArrowTurnDownLeft />],
  ["up-right", <HiArrowTurnDownRight />],

  ["down-up", <FaUpLong />],
  ["down-left", <HiArrowTurnUpLeft />],
  ["down-right", <HiArrowTurnUpRight />],

  ["left-right", <FaRightLong />],
  ["left-up", <HiArrowTurnRightUp />],
  ["left-down", <HiArrowTurnRightDown />],

  ["right-left", <FaLeftLong />],
  ["right-up", <HiArrowTurnLeftUp />],
  ["right-down", <HiArrowTurnLeftDown />],
]);


export const ActionIcons = {
  delete: <TiDelete size={"20px"}/>,
  move: <TiArrowMove size={"20px"}/>,
  cancel: <TiCancel size={"20px"}/>,
};

export const DirectionIcons = {
  down: <IoIosArrowDown />,
  up: <IoIosArrowUp />,
  left: <IoIosArrowBack />,
  right: <IoIosArrowForward />,
};

export const RotationIcons = {
  counterclockwise: <PiArrowCounterClockwiseBold />,
  clockwise: <PiArrowClockwiseBold />,
} 

export function getEntryIcon(direction: DirectionType) {
  return (DirectionIcons[getInvertedDirection(direction)]);
}
