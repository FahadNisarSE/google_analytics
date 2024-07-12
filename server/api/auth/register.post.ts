import db from "~/dirzzle/db";

export default defineEventHandler(async (event) => {
  try {
    const { name, email, password } = await readBody(event);
    console.log("Body", { name, email, password });
  } catch (error) {
    console.log("Something went wrong....");
  }
});
