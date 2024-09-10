import { DDquizFormData } from "./type";

export const handleSubmitData = (formData: DDquizFormData) => {
  const jsonData = JSON.stringify(formData, null, 2);
  try {
    // Store the JSON string in localStorage
    localStorage.setItem("ddQuizFormdata", jsonData);
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
};
