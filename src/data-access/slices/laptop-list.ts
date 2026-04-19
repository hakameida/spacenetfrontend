import type { InitialStateInterface } from '@/util/list/typed-slice';
import { listSlice } from '@/util/list/list.slice';
import type { ListInterface } from '@/util/list/list.slice';

// Define laptop item interface
export interface LaptopItem {
  id: string;
  name: string;
  description: string;
  discount: string;
  price: string;
  age: string;
  image: string;
  cpu: string;
  gpu: string;
  ram: string;
  hard: string;
  screen: string;
  color: string;
  os: string;
  dynamicSpecs: Array<{ key: string; value: string }>;
}

// Use ListInterface as the response type (not LaptopItem directly)
export const {
    setItemList: setLaptopListItemList,
    addItem: addLaptopListItem,
    resetItemList: resetLaptopList,
    removeItem: removeLaptopListItem
} = listSlice('laptop-list').actions;

// Selector - returns array of objects, we cast to LaptopItem[]
export const selectLaptopListList = (state: { laptopList: InitialStateInterface<ListInterface> }) => {
  return state.laptopList.response.listItemList as LaptopItem[];
};

export const laptopList = listSlice('laptop-list').reducer;