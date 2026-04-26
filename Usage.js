import { CustomClassicModel, None } from "./drea.js";

const schema = {
  name: { rule: None, errorMsg: "Name must be a string" },
  age: { rule: (v) => typeof v === "number", errorMsg: "Age must be a number" }
};
const custom = new CustomClassicModel(schema);
console.log(custom.validate({ name: "JoeBless", age: 25 }));