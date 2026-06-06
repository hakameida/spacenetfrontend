import type { InitialStateInterface } from '@/util/list/typed-slice';
import { listSlice } from '@/util/list/list.slice';
import type { ListInterface } from '@/util/list/list.slice';

export interface CameraItem {
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
  sensor_type: string;
  megapixels: string;
  video_resolution: string;
  lens_mount: string;
  type_id: string;
  type_name: string;      // DSLR, Mirrorless, Compact, Action
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
    setItemList: setCameraListItemList,
    addItem: addCameraListItem,
    resetItemList: resetCameraList,
    removeItem: removeCameraListItem
} = listSlice('camera-list').actions;

export const selectCameraListList = (state: { cameraList: InitialStateInterface<ListInterface> }) => {
  return state.cameraList.response.listItemList as CameraItem[];
};

export const cameraList = listSlice('camera-list').reducer;