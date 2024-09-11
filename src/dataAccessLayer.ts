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

export const sampleDatabase = [
  {
    imgUrl:
      "https://stluc.manta.uqcloud.net/elipse/public/CHUBS/VETS-TST/undefined/66de8da3bf6c10611cc15078.png",
    position: {
      x: 19,
      y: 19.88330078125,
    },
    width: 24,
    height: 11,
    label: "testdata",
  },
];
