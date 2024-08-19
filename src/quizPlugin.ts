import { App } from "vue";
import DraggableBox from "./components/DraggableBox.vue";
// import { PluginOption } from "./type";

export function quizPlugin(app: App) {
  //   const { placeHolder } = options;

  // Register Component
  app.component("DraggableBox", DraggableBox);
  //   app.provide("$spaceHolder", placeHolder || null);
}

export { DraggableBox };
