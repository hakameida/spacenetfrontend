import type { InitialStateInterface } from '@/util/list/typed-slice';
import { listSlice } from '@/util/list/list.slice';
import type { ListInterface } from '@/util/list/list.slice';

export interface TableGamingChairItem {
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
  model_number: string;
  dimensions: string;
  max_weight: string;
  color: string;
  weight: string;
  height_adjustable: boolean;
  url1: string; url2: string; url3: string; url4: string; url5: string;
  image1: string; image2: string; image3: string; image4: string; image5: string;
  image: string;
  dynamicSpecs: Array<{ key: string; value: string }>;
}

export const {
    setItemList: setTableGamingChairListItemList,
    addItem: addTableGamingChairListItem,
    resetItemList: resetTableGamingChairList,
    removeItem: removeTableGamingChairListItem
} = listSlice('table-gaming-chair-list').actions;

export const selectTableGamingChairListList = (state: { tableGamingChairList: InitialStateInterface<ListInterface> }) => {
  return state.tableGamingChairList.response.listItemList as TableGamingChairItem[];
};

export const tableGamingChairList = listSlice('table-gaming-chair-list').reducer;