import { createServer } from "miragejs";
import { SEED_TASKS } from "./seedTasks";

export function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,

    routes() {
      this.namespace = "api";
      this.timing = 0;

      this.get("/tasks", () => ({
        tasks: SEED_TASKS,
      }));
    },
  });
}
