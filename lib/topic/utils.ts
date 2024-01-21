import {doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, Timestamp} from "@firebase/firestore";
import {IComment, ITopic, IUser} from "@/lib/interfaces";
import {db} from "@/lib/firebase/config";

async function getAuthor(authorReference: DocumentReference): Promise<IUser> {
    const authorSnapshot = await getDoc(authorReference);

    if (!authorSnapshot.exists() || typeof authorSnapshot.data() === "undefined") {
        throw new Error("Author does not exist");
    }

    const data = authorSnapshot.data();
    const comments = await getComments(data.comments);
    const downVotedComments = data.downVotedComments;
    const downVotedTopics = data.downVotedTopics;
    const saved = await getSaved(data.saved);
    const upVotedComments = data.upVotedComments;
    const upVotedTopics = data.upVotedTopics;
    const username = data.username;
    const followers = data.followers;
    const following = data.following;
    const topics: ITopic[] = [];

    for (const ref of data.topics) {
        const topic = await getTopic(ref.id);
        topics.push(topic);
    }

    return {
        uid: authorReference.id,
        comments,
        downVotedComments,
        downVotedTopics,
        saved,
        topics,
        upVotedComments,
        upVotedTopics,
        username,
        followers,
        following,
    }
}

async function getTopic(uid: string): Promise<ITopic> {
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

async function getSaved(savedReferences: DocumentReference[]): Promise<(ITopic | IComment)[]> {
    const saved: (ITopic | IComment)[] = [];

    for (const ref of savedReferences) {
        if (ref.path.includes("comment")) {
            const comment = await getComment(ref);

            saved.push(comment);
        }
        else {
            const topic = await getTopic(ref.id);

            saved.push(topic);
        }
    }

    return saved;
}

async function getComment(commentReference: DocumentReference): Promise<IComment> {
    const commentSnapshot = await getDoc(commentReference);

    if (!commentSnapshot.exists() || typeof commentSnapshot.data() === "undefined") {
        throw new Error("Comment does not exist");
    }

    return {
        uid: commentSnapshot.id,
        answers: commentSnapshot.data().answers,
        author: commentSnapshot.data().author,
        body: commentSnapshot.data().body,
        creationDate: commentSnapshot.data().creationDate,
        parentComment: commentSnapshot.data().parentComment,
        topicRef: commentSnapshot.data().topicRef,
        upVoted: commentSnapshot.data().upVoted,
        downVoted: commentSnapshot.data().downVoted,
    };
}

async function getComments(commentReferences: DocumentReference[]): Promise<IComment[]> {
    const comments: IComment[] = [];

    for (const reference of commentReferences) {
        const comment = await getComment(reference);

        comments.push(comment);
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

function formatTime(timestamp: Timestamp): string {
    const now = Timestamp.now();
    const elapsedSeconds = now.seconds - timestamp.seconds;

    const minute = 60;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (elapsedSeconds < minute) {
        return `${elapsedSeconds} second${elapsedSeconds !== 1 ? 's' : ''} ago`;
    } else if (elapsedSeconds < hour) {
        const minutes = Math.floor(elapsedSeconds / minute);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (elapsedSeconds < day) {
        const hours = Math.floor(elapsedSeconds / hour);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(elapsedSeconds / day);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
}

export {
    formatTime,
    getAuthor,
    getTopic,
    getComments,
    getCommentAnswers,
    getSaved,
}
