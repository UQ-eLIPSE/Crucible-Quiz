export type PluginOption = {
  placeHolder: string;
};

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $placeholder: string;
  }
}

export interface Item {
  id: number;
  label: string;
  position: { x: number; y: number; width: number; height: number };
  list: number;
}

export interface QuizOption {
  id: number;
  label: string;
  position: { x: number; y: number; width: number; height: number };
  list?: number;
}

export interface DDquizFormData {
  image: string;
  collectPosition: QuizOption[];
}
