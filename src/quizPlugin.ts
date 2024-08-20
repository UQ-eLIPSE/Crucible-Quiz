import { App } from "vue";
import DraggableBox from "./components/DraggableBox.vue";

export function quizPlugin(app: App) {
  app.component("DraggableBox", DraggableBox);
}

export { DraggableBox };
