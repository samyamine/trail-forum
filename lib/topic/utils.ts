import {doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, Timestamp} from "@firebase/firestore";
import {IComment, ITopic, IUser} from "@/lib/interfaces";
import {db} from "@/lib/firebase/config";

async function getAuthor(authorReference: DocumentReference): Promise<IUser> {
    const authorSnapshot = await getDoc(authorReference);

    if (!authorSnapshot.exists() || typeof authorSnapshot.data() === "undefined") {
        throw new Error("Author does not exist");
    }

    return authorSnapshot.data() as IUser;
}

async function getTopic(uid: string): Promise<ITopic> {
    console.log(`UID: ${uid}`);
    const topicRef = doc(db, "topics", uid);
    const topicSnapshot = await getDoc(topicRef);

    if (!topicSnapshot.exists()) {
        throw new Error("Topic does not exist");
    }

    return {
        uid: topicSnapshot.id,
        author: topicSnapshot.data().author,
        body: topicSnapshot.data().body,
        category: topicSnapshot.data().category,
        comments: topicSnapshot.data().comments,
        creationDate: topicSnapshot.data().creationDate,
        title: topicSnapshot.data().title,
        upVoted: topicSnapshot.data().upVoted,
        downVoted: topicSnapshot.data().downVoted,
    };
}

async function getTopicComments(commentReferences: DocumentReference[]): Promise<IComment[]> {
    const comments: IComment[] = [];

    for (const reference of commentReferences) {
        const commentSnapshot = await getDoc(reference);

        if (!commentSnapshot.exists() || typeof commentSnapshot.data() === "undefined") {
            throw new Error("Comment does not exist");
        }

        comments.push({
            uid: commentSnapshot.id,
            answers: commentSnapshot.data().answers,
            author: commentSnapshot.data().author,
            body: commentSnapshot.data().body,
            creationDate: commentSnapshot.data().creationDate,
            parentComment: commentSnapshot.data().parentComment,
            topicRef: commentSnapshot.data().topicRef,
            upVoted: commentSnapshot.data().upVoted,
            downVoted: commentSnapshot.data().downVoted,
        });
    }

    return comments;
}

async function getCommentAnswers(answerReferences: DocumentReference[]): Promise<IComment[]> {
    const answers: IComment[] = [];

    for (const reference of answerReferences) {
        const answerSnapshot = await getDoc(reference);

        if (!answerSnapshot.exists() || typeof answerSnapshot.data() === "undefined") {
            throw new Error("Answer does not exist");
        }

        answers.push({
            uid: answerSnapshot.id,
            answers: [],
            author: answerSnapshot.data().author,
            body: answerSnapshot.data().body,
            creationDate: answerSnapshot.data().creationDate,
            parentComment: answerSnapshot.data().parentComment,
            topicRef: answerSnapshot.data().topicRef,
            upVoted: answerSnapshot.data().upVoted,
            downVoted: answerSnapshot.data().downVoted,
        });
    }

    return answers;
}

export {
    getAuthor,
    getTopic,
    getTopicComments,
    getCommentAnswers,
}
