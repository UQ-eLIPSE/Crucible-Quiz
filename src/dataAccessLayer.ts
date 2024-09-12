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
    width: 201,
    height: 40,
    label: "testdata",
  },
  {
    position: {
      x: 190,
      y: 190.88330078125,
    },
    width: 100,
    height: 40,
    label: "testdata2",
  },
  {
    position: {
      x: 100,
      y: 100.88330078125,
    },
    width: 100,
    height: 40,
    label: "testdata3",
  },
  {
    position: {
      x: 140,
      y: 140.88330078125,
    },
    width: 100,
    height: 40,
    label: "testdata24",
  },
];
