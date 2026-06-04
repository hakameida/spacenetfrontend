// src/data-access/slices/accessory-list.ts

import type { InitialStateInterface } from '@/util/list/typed-slice';
import { listSlice } from '@/util/list/list.slice';
import type { ListInterface } from '@/util/list/list.slice';

export interface AccessoryItem {
  id: string;
  name: string;
  description: string;
  discount: string;
  price: string;
  age: string;
  status: boolean;
  count: number;
  brand: string;
  model_number: string;
  compatibility: string;
  type_id: string;
  type_name: string;      // English: keyboard, mouse, headset
  image: string;
  url1: string;
  url2: string;
  url3: string;
  url4: string;
  url5: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
  dynamicSpecs: Array<{ key: string; value: string }>;
}

export const {
    setItemList: setAccessoryListItemList,
    addItem: addAccessoryListItem,
    resetItemList: resetAccessoryList,
    removeItem: removeAccessoryListItem
} = listSlice('accessory-list').actions;

export const selectAccessoryListList = (state: { accessoryList: InitialStateInterface<ListInterface> }) => {
  return state.accessoryList.response.listItemList as AccessoryItem[];
};

export const accessoryList = listSlice('accessory-list').reducer;