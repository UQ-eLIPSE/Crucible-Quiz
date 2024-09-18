export type PluginOption = {
  placeHolder: string;
};

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $placeholder: string;
  }
}

export interface Item {
  id: string;
  label: string;
  width: number; 
  height: number;
  position: { x: number; y: number };
  list: number;
}

export interface QuizOption {
  id: string;
  label: string;
  width: number; 
  height: number;
  position: { x: number; y: number };
  list?: number;
}

export interface DDquizFormData {
  imageFile?: File;
  image: string ;
  collectPosition: QuizOption[];
}

export interface ItemStyle {
  top: string;
  left: string;
  width: string;
  height: string;
}

export interface OptionsDatabase {
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  label: string;
}

export interface DRAG_DROP_LIST {
  id: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  label: string;
}

export interface QUIZ_QUESTION_DRAG_DROP {
  imgUrl: string;
  optionsList: DRAG_DROP_LIST[];
}