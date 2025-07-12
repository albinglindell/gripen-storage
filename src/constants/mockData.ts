import { CardboardBox } from "../types/storage";

export const MOCK_ROOM_NAMES: { [key: string]: string } = {
  "1": "Living Room",
  "2": "Bedroom",
  "3": "Kitchen",
  "4": "Basement",
  "5": "Attic",
};

export const MOCK_BOXES: CardboardBox[] = [
  {
    id: "1",
    boxNumber: "1",
    roomId: "1",
    description: "Books and documents",
    imageUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
    items: [
      { id: "1", name: "Old books", quantity: 15, category: "Books" },
      {
        id: "2",
        name: "Important documents",
        quantity: 1,
        category: "Documents",
      },
      { id: "3", name: "Magazines", quantity: 8, category: "Reading" },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    boxNumber: "2",
    roomId: "1",
    description: "Electronics and cables",
    imageUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
    items: [
      {
        id: "4",
        name: "Phone chargers",
        quantity: 5,
        category: "Electronics",
      },
      { id: "5", name: "USB cables", quantity: 12, category: "Electronics" },
      {
        id: "6",
        name: "Power adapters",
        quantity: 3,
        category: "Electronics",
      },
    ],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    boxNumber: "3",
    roomId: "1",
    description: "Kitchen items",
    imageUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    items: [
      { id: "7", name: "Coffee mugs", quantity: 8, category: "Kitchen" },
      { id: "8", name: "Plates", quantity: 12, category: "Kitchen" },
      { id: "9", name: "Cutlery", quantity: 1, category: "Kitchen" },
    ],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "4",
    boxNumber: "4",
    roomId: "1",
    description: "Clothing and accessories",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    items: [
      {
        id: "10",
        name: "Winter clothes",
        quantity: 20,
        category: "Clothing",
      },
      { id: "11", name: "Shoes", quantity: 8, category: "Footwear" },
      { id: "12", name: "Accessories", quantity: 15, category: "Fashion" },
    ],
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "5",
    boxNumber: "5",
    roomId: "1",
    description: "Tools and hardware",
    imageUrl:
      "https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=800&h=600&fit=crop",
    items: [
      { id: "13", name: "Screwdrivers", quantity: 6, category: "Tools" },
      {
        id: "14",
        name: "Nails and screws",
        quantity: 100,
        category: "Hardware",
      },
      { id: "15", name: "Measuring tape", quantity: 2, category: "Tools" },
    ],
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "6",
    boxNumber: "2",
    roomId: "2",
    description: "Bedroom accessories",
    imageUrl:
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&h=600&fit=crop",
    items: [
      { id: "16", name: "Pillows", quantity: 4, category: "Bedding" },
      { id: "17", name: "Blankets", quantity: 3, category: "Bedding" },
      { id: "18", name: "Curtains", quantity: 2, category: "Home" },
    ],
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    id: "7",
    boxNumber: "1",
    roomId: "3",
    description: "Kitchen utensils",
    imageUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    items: [
      { id: "19", name: "Pots and pans", quantity: 6, category: "Kitchen" },
      { id: "20", name: "Spatulas", quantity: 4, category: "Kitchen" },
      { id: "21", name: "Measuring cups", quantity: 3, category: "Kitchen" },
    ],
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "8",
    boxNumber: "2",
    roomId: "3",
    description: "Kitchen cutlery and utensils",
    imageUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    items: [
      { id: "22", name: "Table spoons", quantity: 12, category: "Kitchen" },
      { id: "23", name: "Tea spoons", quantity: 8, category: "Kitchen" },
      { id: "24", name: "Forks", quantity: 12, category: "Kitchen" },
      { id: "25", name: "Knives", quantity: 8, category: "Kitchen" },
    ],
    createdAt: new Date("2024-02-12"),
    updatedAt: new Date("2024-02-12"),
  },
  {
    id: "9",
    boxNumber: "3",
    roomId: "3",
    description: "Baking supplies",
    imageUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    items: [
      { id: "26", name: "Measuring spoons", quantity: 2, category: "Kitchen" },
      { id: "27", name: "Table spoons", quantity: 6, category: "Kitchen" },
      { id: "28", name: "Mixing bowls", quantity: 4, category: "Kitchen" },
    ],
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
];
