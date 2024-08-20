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
  title: string;
  list: number;
  position: { x: number; y: number };
}
