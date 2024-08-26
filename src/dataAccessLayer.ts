import { DDquizFormData } from "./type";

export const handleSubmitData = (formData: DDquizFormData) => {
  console.log(formData);

  const jsonData = JSON.stringify(formData, null, 2);
  console.log(jsonData);
  try {
    // Store the JSON string in localStorage
    localStorage.setItem("ddQuizFormdata", jsonData);
    console.log("ddQuizFormdata stored in localStorage!");
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
};
