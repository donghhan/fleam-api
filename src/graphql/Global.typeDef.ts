import { objectType } from "nexus";

// Global Result Type
export const GlobalResult = objectType({
  name: "GlobalResult",
  definition(t) {
    t.nonNull.boolean("ok");
    t.string("error");
  },
});
