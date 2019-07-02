module.exports = {
  client: {
    includes: ["./queries/*.ts", "./mutations/*.ts"],
    service: {
      name: "saleor",
      url: "http://localhost:8000/graphql/"
    }
  }
};
