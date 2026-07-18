// data-access/slices/case-list.ts
import type { InitialStateInterface } from '@/util/list/typed-slice';
import { listSlice } from '@/util/list/list.slice';
import type { ListInterface } from '@/util/list/list.slice';

export interface CaseItem {
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
  cpu: string;
  gpu: string;
  ram: string;
  motherboard: string;
  psu: string;
  storage: string;
  case: string;
  cooling: string;
  os: string;
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
    setItemList: setCaseListItemList,
    addItem: addCaseListItem,
    resetItemList: resetCaseList,
    removeItem: removeCaseListItem
} = listSlice('case-list').actions;

export const selectCaseListList = (state: { caseList: InitialStateInterface<ListInterface> }) => {
  return state.caseList.response.listItemList as CaseItem[];
};

export const caseList = listSlice('case-list').reducer;