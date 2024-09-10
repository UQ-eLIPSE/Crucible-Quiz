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
  dimensions: { width: number; height: number };
  position: { x: number; y: number };
  initialPosition?: { x: number; y: number };
  list: number;
}

export interface QuizOption {
  id: number;
  label: string;
  dimensions: { width: number; height: number };
  position: { x: number; y: number };
  list?: number;
}

export interface DDquizFormData {
  imageFile?: File;
  image: string;
  collectPosition: QuizOption[];
}
