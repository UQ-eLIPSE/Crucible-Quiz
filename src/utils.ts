import { Item } from "./type";

// generate inital position and dimension for question options
export const getInitialVal = (num: number) => {
  return Array.from({ length: num }, (_, index) => {
    return { id: index, x: index * 5, y: index * 30, width: 100, height: 100 };
  });
};

export function getItemStyle(item: Item) {
  return {
    top: item.position.y + "px",
    left: item.position.x + "px",
    width: item.dimensions.width + "px",
    height: item.dimensions.height + "px",
  };
}
