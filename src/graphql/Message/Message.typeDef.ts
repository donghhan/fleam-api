import { objectType } from "nexus";

// Message Type
export const Message = objectType({
  name: "Message",
  description: "Message object type",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("createdAt");
    t.nonNull.string("updatedAt");
    t.nonNull.string("payload");
    t.nonNull.field("user", { type: "User" });
    t.nonNull.field("room", { type: "ChatRoom" });
  },
});

// ChatRoom Type
export const ChatRoom = objectType({
  name: "ChatRoom",
  description: "ChatRoom object type",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("createdAt");
    t.nonNull.string("updatedAt");
    t.list.field("user", { type: "User" });
    t.list.field("messages", { type: "Message" });
  },
});
