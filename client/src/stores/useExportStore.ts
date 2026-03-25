import { create } from "zustand";

export interface ExportRecord {
  id: string;
  itemName: string;
  category: string;
  type: "book" | "supply";
  quantity: number;
  exportedBy: string;
  exportDate: string;
  reason: string;
}

interface ExportStore {
  exports: ExportRecord[];
  addExport: (record: ExportRecord) => void;
}

export const useExportStore = create<ExportStore>((set) => ({
  exports: [],
  addExport: (record) => set((state) => ({ exports: [record, ...state.exports] })),
}));
