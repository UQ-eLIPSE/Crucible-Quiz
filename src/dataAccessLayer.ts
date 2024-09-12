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

export const imageSource = "https://stluc.manta.uqcloud.net/elipse/public/CHUBS/VETS-TST/undefined/66de8da3bf6c10611cc15078.png";

export const sampleDatabase = [
  {
    position: {
      x: 19,
      y: 19.88330078125,
    },
    width: 150,
    height: 150,
    label: "testdata",
  },
];
