// Type Definition
export * from "./typeDef";

// User Part
export * from "./User/Mutation/createAccount.mutation";
export * from "./User/Mutation/signin.mutation";
export * from "./User/Mutation/UserFollow.mutation";
export * from "./User/Query/IsMyself.query";
export * from "./User/Query/UserFollow.query";
export * from "./User/Mutation/editProfile.mutation";

// Photo Part
export * from "./Photo/Mutation/deletePhoto.mutation";
export * from "./Photo/Mutation/uploadPhoto.mutation";
export * from "./Photo/Mutation/editPhoto.mutation";
export * from "./Photo/Query/Photo.query";

// Photo - Feed Part
export * from "./Photo/Query/Feed.query";

// Photo - Like Part
export * from "./Photo/Mutation/Like.mutation";
export * from "./Photo/Query/Like.query";

// Comment
export * from "./Comment/Mutation/Comment.mutation";
export * from "./Comment/Query/Comment.query";

// Message
export * from "./Message/Query/seeRooms.query";
export * from "./Message/Query/seeRoom.query";
export * from "./Message/Mutation/createRoom.mutation";
