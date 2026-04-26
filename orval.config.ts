export default {
  api: {
    input: "./schema.yaml",
    output: {
      target: "./src/api/generated.ts",
      schemas: "./src/api/schema",
      client: "react-query",
    },
  },
};
