const url = "http://localhost:8080/api/v1";
const axios = require("axios");

describe("User route", () => {
  test("The login route with the user", async () => {
    const res = await axios.post(`${url}/login`, {
      email: "iterahero2022@gmail.com",
      password: "iterahero2022",
    });
    expect(res.data.code).toBe(200);
    expect(res.data.data.email).toEqual("iterahero2022@gmail.com");
  });

  test("The login route with the wrong user", async () => {
    const res = await axios.post(`${url}/login`, {
      email: "iterahero2023@gmail.com",
      password: "iterahero2022",
    });
    expect(res.data.code).toBe(404);
    expect(res.data.message).toEqual("Email is not found");
  });

  test("The login route with the wrong password", async () => {
    const res = await axios.post(`${url}/login`, {
      email: "iterahero2022@gmail.com",
      password: "iterahero",
    });
    expect(res.data.code).toBe(401);
    expect(res.data.message).toEqual("Email or password is incorrect");
  });
});
