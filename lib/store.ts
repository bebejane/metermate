import { create } from 'zustand';
import { shallow, useShallow } from 'zustand/shallow';

export interface StoreState {
	subMenu: 'products' | 'contact' | null;
	setSubMenu: (subMenu: 'products' | 'contact' | null) => void;
	openToggleTextId: string | null;
	setOpenToggleTextId: (id: string | null) => void;
	openMobileMenu: boolean;
	setOpenMobileMenu: (open: boolean) => void;
}

const useStore = create<StoreState>((set) => ({
	subMenu: null,
	setSubMenu: (subMenu) => set({ subMenu }),
	openToggleTextId: null,
	setOpenToggleTextId: (id) => set({ openToggleTextId: id }),
	openMobileMenu: false,
	setOpenMobileMenu: (open) => set({ openMobileMenu: open }),
}));

export { shallow, useStore, useShallow };
