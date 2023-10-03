const { getLocalISOString } = require("../../src/utils/timestamp-utils");

const date = getLocalISOString();
const dataGreenhouse = [
  {
    // id_greenhouse: 1,
    name: "Greenhouse ITERA",
    image:
      "https://res.cloudinary.com/applaporan/image/upload/v1668391844/greenhouse_images/ml6tgsewm10fj7xztrzl.jpg",
    location: "Lampung Selatan",
    created_at: date,
    updated_at: date,
    id_user: 1,
  },
];

module.exports = dataGreenhouse;
