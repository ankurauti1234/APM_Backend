const request = require("supertest");
const { expect } = require("chai");
const server = require("../server"); // Adjust the path if necessary

describe("GET /all", () => {
  it("should return paginated data", async () => {
    const response = await request(server)
      .get("/all")
      .query({ page: 1, limit: 10 });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("totalCount");
    expect(response.body).to.have.property("results").that.is.an("array");
  });

  it("should filter data based on query parameters", async () => {
    const response = await request(server)
      .get("/all")
      .query({ page: 1, limit: 5, deviceId: "1234", online: "true" });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("totalCount");
    expect(response.body).to.have.property("results").that.is.an("array");
  });

  // Add more tests for different scenarios if needed
});
