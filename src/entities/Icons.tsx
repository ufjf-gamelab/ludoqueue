import { FaRightLong, FaLeftLong, FaUpLong, FaDownLong, FaSink } from "react-icons/fa6";
import { GiMiner } from "react-icons/gi";
import { BsMinecartLoaded } from "react-icons/bs";
import { BsSafe2 } from "react-icons/bs";
import { TiArrowMove, TiCancel, TiDelete } from "react-icons/ti";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward, IoIosArrowUp } from "react-icons/io";
import type { DirectionType } from "./EntitiesTypes";
import { PiArrowClockwiseBold, PiArrowCounterClockwiseBold } from "react-icons/pi";


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

export const TransportIcons = {
  down: <FaDownLong/>,
  up: <FaUpLong />,
  left: <FaLeftLong />,
  right: <FaRightLong />,
};

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
  switch (direction) {
    case "down":
      return <IoIosArrowUp />;
    case "up":
      return <IoIosArrowDown />;
    case "left":
      return <IoIosArrowForward />;
    case "right":
      return <IoIosArrowBack />;
  }
}
