import type { InitialStateInterface } from '@/util/list/typed-slice';
import { listSlice } from '@/util/list/list.slice';
import type { ListInterface } from '@/util/list/list.slice';

export interface ComputerItem {
  id: string;
  name: string;
  description: string;
  discount: string;
  price: string;
  age: string;
  status: boolean;
  count: number;
  type_id: string;
  type_name: string;      // English: gaming, office, workstation
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
    setItemList: setComputerListItemList,
    addItem: addComputerListItem,
    resetItemList: resetComputerList,
    removeItem: removeComputerListItem
} = listSlice('computer-list').actions;

export const selectComputerListList = (state: { computerList: InitialStateInterface<ListInterface> }) => {
  return state.computerList.response.listItemList as ComputerItem[];
};

export const computerList = listSlice('computer-list').reducer;