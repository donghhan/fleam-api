/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * The `Upload` scalar type represents a file upload.
     */
    upload<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Upload";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * The `Upload` scalar type represents a file upload.
     */
    upload<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Upload";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  Upload: any
}

export interface NexusGenObjects {
  ChatRoom: { // root type
    createdAt: string; // String!
    id: string; // String!
    messages?: Array<NexusGenRootTypes['Message'] | null> | null; // [Message]
    updatedAt: string; // String!
    user?: Array<NexusGenRootTypes['User'] | null> | null; // [User]
  }
  Comment: { // root type
    createdAt: string; // String!
    id: string; // String!
    payload: string; // String!
    photo: NexusGenRootTypes['Photo']; // Photo!
    updatedAt: string; // String!
  }
  GlobalResult: { // root type
    error?: string | null; // String
    ok: boolean; // Boolean!
  }
  Hashtag: { // root type
    createdAt: string; // String!
    hashtag: string; // String!
    id: string; // String!
    updatedAt: string; // String!
  }
  Like: { // root type
    createdAt: string; // String!
    id: string; // String!
    photo: NexusGenRootTypes['Photo']; // Photo!
    updatedAt: string; // String!
  }
  Message: { // root type
    createdAt: string; // String!
    id: string; // String!
    payload: string; // String!
    room: NexusGenRootTypes['ChatRoom']; // ChatRoom!
    updatedAt: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Mutation: {};
  Photo: { // root type
    caption?: string | null; // String
    createdAt: string; // String!
    file: string; // String!
    id: string; // String!
    updatedAt: string; // String!
  }
  Query: {};
  SeeFollowerResult: { // root type
    error?: string | null; // String
    followers?: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    ok: boolean; // Boolean!
    totalPages?: number | null; // Int
  }
  SeeFollowingResult: { // root type
    error?: string | null; // String
    following?: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    ok: boolean; // Boolean!
  }
  SigninWithTokenResult: { // root type
    error?: string | null; // String
    ok: boolean; // Boolean!
    token?: string | null; // String
  }
  User: { // root type
    avatar?: string | null; // String
    bio?: string | null; // String
    createdAt: string; // String!
    email: string; // String!
    firstName?: string | null; // String
    followers?: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    following?: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    id: string; // String!
    password: string; // String!
    updatedAt: string; // String!
    username: string; // String!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  ChatRoom: { // field return type
    createdAt: string; // String!
    id: string; // String!
    messages: Array<NexusGenRootTypes['Message'] | null> | null; // [Message]
    updatedAt: string; // String!
    user: Array<NexusGenRootTypes['User'] | null> | null; // [User]
  }
  Comment: { // field return type
    createdAt: string; // String!
    id: string; // String!
    isMyself: boolean; // Boolean!
    payload: string; // String!
    photo: NexusGenRootTypes['Photo']; // Photo!
    updatedAt: string; // String!
  }
  GlobalResult: { // field return type
    error: string | null; // String
    ok: boolean; // Boolean!
  }
  Hashtag: { // field return type
    createdAt: string; // String!
    hashtag: string; // String!
    id: string; // String!
    photos: Array<NexusGenRootTypes['Photo'] | null> | null; // [Photo]
    totalPhotos: number | null; // Int
    updatedAt: string; // String!
  }
  Like: { // field return type
    createdAt: string; // String!
    id: string; // String!
    photo: NexusGenRootTypes['Photo']; // Photo!
    updatedAt: string; // String!
  }
  Message: { // field return type
    createdAt: string; // String!
    id: string; // String!
    payload: string; // String!
    room: NexusGenRootTypes['ChatRoom']; // ChatRoom!
    updatedAt: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Mutation: { // field return type
    createAccount: NexusGenRootTypes['User'] | null; // User
    createComment: NexusGenRootTypes['GlobalResult'] | null; // GlobalResult
    deleteComment: NexusGenRootTypes['GlobalResult'] | null; // GlobalResult
    deletePhoto: NexusGenRootTypes['GlobalResult'] | null; // GlobalResult
    editComment: NexusGenRootTypes['GlobalResult'] | null; // GlobalResult
    editPhoto: NexusGenRootTypes['GlobalResult'] | null; // GlobalResult
    editProfile: NexusGenRootTypes['GlobalResult'] | null; // GlobalResult
    followUser: NexusGenRootTypes['GlobalResult'] | null; // GlobalResult
    searchUsers: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    signin: NexusGenRootTypes['SigninWithTokenResult'] | null; // SigninWithTokenResult
    toggleLike: NexusGenRootTypes['GlobalResult'] | null; // GlobalResult
    unfollowUser: NexusGenRootTypes['GlobalResult'] | null; // GlobalResult
    uploadPhoto: NexusGenRootTypes['Photo'] | null; // Photo
  }
  Photo: { // field return type
    caption: string | null; // String
    comments: number | null; // Int
    createdAt: string; // String!
    file: string; // String!
    hashtags: Array<NexusGenRootTypes['Hashtag'] | null> | null; // [Hashtag]
    id: string; // String!
    isMyself: boolean; // Boolean!
    likes: number; // Int!
    updatedAt: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Query: { // field return type
    searchPhoto: NexusGenRootTypes['Photo'] | null; // Photo
    seeFeed: Array<NexusGenRootTypes['Photo'] | null> | null; // [Photo]
    seeFollowers: NexusGenRootTypes['SeeFollowerResult'] | null; // SeeFollowerResult
    seeFollowings: NexusGenRootTypes['SeeFollowingResult'] | null; // SeeFollowingResult
    seeHashtag: NexusGenRootTypes['Hashtag'] | null; // Hashtag
    seeLikes: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    seePhoto: NexusGenRootTypes['Photo'] | null; // Photo
    seePhotoComments: Array<NexusGenRootTypes['Comment'] | null> | null; // [Comment]
    seeProfile: NexusGenRootTypes['User'] | null; // User
    seeRooms: Array<NexusGenRootTypes['ChatRoom'] | null> | null; // [ChatRoom]
  }
  SeeFollowerResult: { // field return type
    error: string | null; // String
    followers: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    ok: boolean; // Boolean!
    totalFollower: number | null; // Int
    totalPages: number | null; // Int
  }
  SeeFollowingResult: { // field return type
    error: string | null; // String
    following: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    ok: boolean; // Boolean!
    totalFollowing: number | null; // Int
  }
  SigninWithTokenResult: { // field return type
    error: string | null; // String
    ok: boolean; // Boolean!
    token: string | null; // String
  }
  User: { // field return type
    avatar: string | null; // String
    bio: string | null; // String
    createdAt: string; // String!
    email: string; // String!
    firstName: string | null; // String
    followers: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    following: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    id: string; // String!
    isFollowing: boolean; // Boolean!
    isMyself: boolean; // Boolean!
    password: string; // String!
    photos: Array<NexusGenRootTypes['Photo'] | null> | null; // [Photo]
    totalFollower: number; // Int!
    totalFollowing: number; // Int!
    updatedAt: string; // String!
    username: string; // String!
  }
}

export interface NexusGenFieldTypeNames {
  ChatRoom: { // field return type name
    createdAt: 'String'
    id: 'String'
    messages: 'Message'
    updatedAt: 'String'
    user: 'User'
  }
  Comment: { // field return type name
    createdAt: 'String'
    id: 'String'
    isMyself: 'Boolean'
    payload: 'String'
    photo: 'Photo'
    updatedAt: 'String'
  }
  GlobalResult: { // field return type name
    error: 'String'
    ok: 'Boolean'
  }
  Hashtag: { // field return type name
    createdAt: 'String'
    hashtag: 'String'
    id: 'String'
    photos: 'Photo'
    totalPhotos: 'Int'
    updatedAt: 'String'
  }
  Like: { // field return type name
    createdAt: 'String'
    id: 'String'
    photo: 'Photo'
    updatedAt: 'String'
  }
  Message: { // field return type name
    createdAt: 'String'
    id: 'String'
    payload: 'String'
    room: 'ChatRoom'
    updatedAt: 'String'
    user: 'User'
  }
  Mutation: { // field return type name
    createAccount: 'User'
    createComment: 'GlobalResult'
    deleteComment: 'GlobalResult'
    deletePhoto: 'GlobalResult'
    editComment: 'GlobalResult'
    editPhoto: 'GlobalResult'
    editProfile: 'GlobalResult'
    followUser: 'GlobalResult'
    searchUsers: 'User'
    signin: 'SigninWithTokenResult'
    toggleLike: 'GlobalResult'
    unfollowUser: 'GlobalResult'
    uploadPhoto: 'Photo'
  }
  Photo: { // field return type name
    caption: 'String'
    comments: 'Int'
    createdAt: 'String'
    file: 'String'
    hashtags: 'Hashtag'
    id: 'String'
    isMyself: 'Boolean'
    likes: 'Int'
    updatedAt: 'String'
    user: 'User'
  }
  Query: { // field return type name
    searchPhoto: 'Photo'
    seeFeed: 'Photo'
    seeFollowers: 'SeeFollowerResult'
    seeFollowings: 'SeeFollowingResult'
    seeHashtag: 'Hashtag'
    seeLikes: 'User'
    seePhoto: 'Photo'
    seePhotoComments: 'Comment'
    seeProfile: 'User'
    seeRooms: 'ChatRoom'
  }
  SeeFollowerResult: { // field return type name
    error: 'String'
    followers: 'User'
    ok: 'Boolean'
    totalFollower: 'Int'
    totalPages: 'Int'
  }
  SeeFollowingResult: { // field return type name
    error: 'String'
    following: 'User'
    ok: 'Boolean'
    totalFollowing: 'Int'
  }
  SigninWithTokenResult: { // field return type name
    error: 'String'
    ok: 'Boolean'
    token: 'String'
  }
  User: { // field return type name
    avatar: 'String'
    bio: 'String'
    createdAt: 'String'
    email: 'String'
    firstName: 'String'
    followers: 'User'
    following: 'User'
    id: 'String'
    isFollowing: 'Boolean'
    isMyself: 'Boolean'
    password: 'String'
    photos: 'Photo'
    totalFollower: 'Int'
    totalFollowing: 'Int'
    updatedAt: 'String'
    username: 'String'
  }
}

export interface NexusGenArgTypes {
  Hashtag: {
    photos: { // args
      page: number; // Int!
    }
  }
  Mutation: {
    createAccount: { // args
      email: string; // String!
      firstName: string; // String!
      password: string; // String!
      username: string; // String!
    }
    createComment: { // args
      payload: string; // String!
      photoId: string; // String!
    }
    deleteComment: { // args
      id: string; // String!
    }
    deletePhoto: { // args
      id: string; // String!
    }
    editComment: { // args
      id: string; // String!
      payload: string; // String!
    }
    editPhoto: { // args
      caption: string; // String!
      id: string; // String!
    }
    editProfile: { // args
      avatar?: NexusGenScalars['Upload'] | null; // Upload
      bio?: string | null; // String
      email?: string | null; // String
      firstName?: string | null; // String
      password?: string | null; // String
    }
    followUser: { // args
      username: string; // String!
    }
    searchUsers: { // args
      keyword: string; // String!
    }
    signin: { // args
      password: string; // String!
      username: string; // String!
    }
    toggleLike: { // args
      id: string; // String!
    }
    unfollowUser: { // args
      username: string; // String!
    }
    uploadPhoto: { // args
      caption?: string | null; // String
      file: string; // String!
    }
  }
  Query: {
    searchPhoto: { // args
      keyword: string; // String!
    }
    seeFollowers: { // args
      page: number; // Int!
      username: string; // String!
    }
    seeFollowings: { // args
      cursor?: number | null; // Int
      username: string; // String!
    }
    seeHashtag: { // args
      hashtag: string; // String!
    }
    seeLikes: { // args
      id: string; // String!
    }
    seePhoto: { // args
      id: string; // String!
    }
    seePhotoComments: { // args
      id: string; // String!
    }
    seeProfile: { // args
      username: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}