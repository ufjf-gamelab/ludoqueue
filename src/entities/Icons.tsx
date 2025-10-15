import { FaRightLong, FaLeftLong, FaUpLong, FaDownLong } from "react-icons/fa6";
import { GiMiner, GiTrashCan } from "react-icons/gi";
import { BsMinecartLoaded } from "react-icons/bs";
import { BsSafe2 } from "react-icons/bs";


export const EntityIcons = {
  stock: <BsSafe2 />,
  consumer: <GiTrashCan />,
  source: <GiMiner />,
  transport: <BsMinecartLoaded />,
};

export const TransportIcons = {
  down: <FaDownLong />,
  up: <FaUpLong />,
  left: <FaLeftLong />,
  right: <FaRightLong />,
};
