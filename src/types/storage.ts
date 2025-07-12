export interface CardboardBox {
  id: string;
  boxNumber: string;
  roomId: string;
  description: string;
  items: StorageItem[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorageItem {
  id: string;
  name: string;
  quantity: number;
  description?: string;
  category?: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  boxCount: number;
}

export interface StorageStats {
  totalRooms: number;
  totalBoxes: number;
}
