import swaggerUi from "swagger-ui-express";
import jsYaml from "js-yaml";
import fs from "fs";
import path from "path";

const yamlFile = fs.readFileSync(path.join(__dirname, "swagger.yaml"), "utf8");

export const swaggerSpec = jsYaml.load(yamlFile);

export const swaggerUiOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};
