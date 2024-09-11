import { Item } from "./type";
export function getItemStyle(item: Item) {
  return {
    top: item.position.y + "px",
    left: item.position.x + "px",
    width: item.dimensions.width + "px",
    height: item.dimensions.height + "px",
  };
}
