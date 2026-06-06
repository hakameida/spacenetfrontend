import type { InitialStateInterface } from '@/util/list/typed-slice';
import { listSlice } from '@/util/list/list.slice';
import type { ListInterface } from '@/util/list/list.slice';

export interface PlayStationItem {
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
  storage: string;
  color: string;
  includes_controller: boolean;
  controller_count: number;
  type_id: string;
  type_name: string;      // PS4, PS5, PS4 Pro, PS5 Slim
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
    setItemList: setPlayStationListItemList,
    addItem: addPlayStationListItem,
    resetItemList: resetPlayStationList,
    removeItem: removePlayStationListItem
} = listSlice('playstation-list').actions;

export const selectPlayStationListList = (state: { playstationList: InitialStateInterface<ListInterface> }) => {
  return state.playstationList.response.listItemList as PlayStationItem[];
};

export const playstationList = listSlice('playstation-list').reducer;