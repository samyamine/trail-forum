import {DocumentData, DocumentReference, DocumentSnapshot, Timestamp} from "@firebase/firestore";

interface IDict<T = string> {
    [key: string]: T | undefined;
}

interface IComment {
    uid: string,
    answers: DocumentReference[],
    author: DocumentReference,
    body: string,
    creationDate: Timestamp,
    parentComment: DocumentReference | undefined,
    topicRef: DocumentReference,
    upVoted: DocumentReference[],
    downVoted: DocumentReference[],
}

interface ITopic {
    uid: string,
    author: DocumentReference,
    body: string,
    category: string,
    comments: DocumentReference[],
    creationDate: Timestamp,
    title: string,
    upVoted: DocumentReference[],
    downVoted: DocumentReference[],
}

interface IUser {
    uid: string,
    comments: DocumentReference[],
    downVotedComments: DocumentReference[],
    downVotedTopics: DocumentReference[],
    topics: DocumentReference[],
    upVotedComments: DocumentReference[],
    upVotedTopics: DocumentReference[],
    username: string,
}

export type {
    IComment,
    IDict,
    ITopic,
    IUser,
}
