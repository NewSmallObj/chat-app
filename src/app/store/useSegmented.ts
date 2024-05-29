import { create } from 'zustand';
import { PostType } from '../db/models/post';
export type SegmentedValueType = '1' | '2' | '3' | '4';

interface SegmentedStore {
  segmentedValue: SegmentedValueType,
  setSegmentedValue:(segmentedValue: SegmentedValueType) => void,
}

const useSegmented = create<SegmentedStore>((set) => ({
  segmentedValue:'1',
  setSegmentedValue: (segmentedValue: SegmentedValueType) => set({ segmentedValue }),
}));

export default useSegmented;