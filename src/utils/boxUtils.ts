import { CardboardBox } from "../types/storage";

export const getItemCount = (box: CardboardBox): number => {
  return box.items.reduce((total, item) => total + item.quantity, 0);
};

export const getCategoryCount = (box: CardboardBox): number => {
  return new Set(box.items.map((item) => item.category)).size;
};

export const filterBoxes = (
  boxes: CardboardBox[],
  searchTerm: string,
  roomFilter: string = "all",
  roomNames: { [key: string]: string } = {}
): CardboardBox[] => {
  return boxes.filter((box) => {
    const matchesSearch =
      box.boxNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      box.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (roomNames[box.roomId] &&
        roomNames[box.roomId]
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      box.items.some(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.category &&
            item.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );

    const matchesRoom = roomFilter === "all" || box.roomId === roomFilter;

    return matchesSearch && matchesRoom;
  });
};
