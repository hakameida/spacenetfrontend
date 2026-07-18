// data-access/slices/storage-list.ts
import type { InitialStateInterface } from '@/util/list/typed-slice';
import { listSlice } from '@/util/list/list.slice';
import type { ListInterface } from '@/util/list/list.slice';

export interface StorageItem {
  id: string;
  name: string;
  description: string;
  discount: string;
  price: string;
  age: string;
  status: boolean;
  count: number;
  type_id: string;
  type_name: string;
  brand: string;
  model_number: string;
  capacity: string;
  read_speed: string;
  write_speed: string;
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
    setItemList: setStorageListItemList,
    addItem: addStorageListItem,
    resetItemList: resetStorageList,
    removeItem: removeStorageListItem
} = listSlice('storage-list').actions;

export const selectStorageListList = (state: { storageList: InitialStateInterface<ListInterface> }) => {
  return state.storageList.response.listItemList as StorageItem[];
};

export const storageList = listSlice('storage-list').reducer;