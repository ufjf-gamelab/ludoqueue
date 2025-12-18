import { FaRightLong, FaLeftLong, FaUpLong, FaDownLong, FaSink } from "react-icons/fa6";
import { GiMiner } from "react-icons/gi";
import { BsMinecartLoaded } from "react-icons/bs";
import { BsSafe2 } from "react-icons/bs";
import { TiArrowMove, TiCancel, TiDelete } from "react-icons/ti";
import { getInvertedDirection, type DirectionType } from "./EntitiesTypes";
import { PiArrowClockwiseBold, PiArrowCounterClockwiseBold } from "react-icons/pi";
import { HiArrowTurnDownLeft, HiArrowTurnDownRight, HiArrowTurnLeftDown, HiArrowTurnLeftUp, HiArrowTurnRightDown, HiArrowTurnRightUp, HiArrowTurnUpLeft, HiArrowTurnUpRight } from "react-icons/hi2";
import type { JSX } from "react";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward, IoIosArrowUp } from "react-icons/io";


export const EntityIcons = {
  stock: <BsSafe2 />,
  consumer: <FaSink />,
  source: <GiMiner />,
  transport: <BsMinecartLoaded />,
  "transport right": <FaRightLong />,
  "transport left": <FaLeftLong />,
  "transport up": <FaUpLong />,
  "transport down": <FaDownLong />
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
  delete: <TiDelete />,
  move: <TiArrowMove />,
  cancel: <TiCancel />,
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
