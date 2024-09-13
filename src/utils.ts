import { Item, OptionsDatabase } from "./type";


// generate inital position and dimension for question options
export const getInitialVal = (items: OptionsDatabase[], dropZoneWidth: number) => {
  let currentX = 2;
  let currentY = 2;
  let rowHeight = 0; 

  return items.map((item, index) => {
    
    if (currentX + item.width > dropZoneWidth) {
      currentX = 0; 
      currentY += rowHeight + 2; 
      rowHeight = 0; 
    }

    rowHeight = Math.max(rowHeight, item.height);

    const position = { id: index, x: currentX, y: currentY };

    currentX += item.width + 2;

    return position;
  });
};




export function getItemStyle(item: Item) {
  return {
    top: item.position.y + "px",
    left: item.position.x + "px",
    width: item.width + "px",
    height: item.height + "px",
  };
}
