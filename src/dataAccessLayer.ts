import { DDquizFormData, QUIZ_QUESTION_DRAG_DROP } from "./type";
import TestDDImage from "./assets/TestDD.png";

export const handleSubmitData = (formData: DDquizFormData) => {
  const jsonData = JSON.stringify(formData, null, 2);
  try {
    // Store the JSON string in localStorage
    localStorage.setItem("ddQuizFormdata", jsonData);
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
};

export const imageSource = TestDDImage;

export const sampleDatabase = [
  {
    id: "1",
    position: {
      x: 19,
      y: 19.88330078125,
    },
    width: 201,
    height: 40,
    label: "testdata",
  },
  {
    id: "2",
    position: {
      x: 190,
      y: 190.88330078125,
    },
    width: 100,
    height: 40,
    label: "testdata2",
  },
  {
    id: "3",
    position: {
      x: 100,
      y: 100.88330078125,
    },
    width: 100,
    height: 40,
    label: "testdata3",
  },
  {
    id: "4",
    position: {
      x: 140,
      y: 140.88330078125,
    },
    width: 100,
    height: 40,
    label: "testdata24",
  },
];

export const sampleQuizQuestion: QUIZ_QUESTION_DRAG_DROP = {
  imgUrl: imageSource,
  optionsList: sampleDatabase,
};
