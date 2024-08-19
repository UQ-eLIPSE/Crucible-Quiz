export type PluginOption = {
  placeHolder: string;
};

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $placeholder: string;
  }
}
