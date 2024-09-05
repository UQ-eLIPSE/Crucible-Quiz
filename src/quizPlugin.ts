import { App } from "vue";
import DraggableBox from "./components/DraggableBox.vue";
import QuizCreator from "./components/QuizCreator.vue";

export function quizPlugin(app: App) {
  app.component("DraggableBox", DraggableBox);
  app.component("QuizCreator", QuizCreator)
}

export { QuizCreator, DraggableBox };
