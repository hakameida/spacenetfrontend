import type { InitialStateInterface } from '@/util/list/typed-slice';
import { listSlice } from '@/util/list/list.slice';
import type { ListInterface } from '@/util/list/list.slice';

export interface BagItem {
  id: string;
  name: string;
  description: string;
  discount: string;
  price: string;
  age: string;
  status: boolean;
  count: number;
  material_id: string;
  material_name: string;
  model_number: string;
  laptop_size: string;
  color: string;
  water_resistant: boolean;
  url1: string; url2: string; url3: string; url4: string; url5: string;
  image1: string; image2: string; image3: string; image4: string; image5: string;
  image: string;
  dynamicSpecs: Array<{ key: string; value: string }>;
}

export const {
    setItemList: setBagListItemList,
    addItem: addBagListItem,
    resetItemList: resetBagList,
    removeItem: removeBagListItem
} = listSlice('bag-list').actions;

export const selectBagListList = (state: { bagList: InitialStateInterface<ListInterface> }) => {
  return state.bagList.response.listItemList as BagItem[];
};

export const bagList = listSlice('bag-list').reducer;