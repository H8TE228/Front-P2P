export default {
  api: {
    input: "http://127.0.0.1:8000/api/v1/schema/",
    output: {
      target: "./src/api/generated.ts",
      schemas: "./src/api/schema",
      client: "react-query",
    },
  },
};
