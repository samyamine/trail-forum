import {collection, DocumentReference, getDocs, query, where} from "@firebase/firestore";
import {db} from "@/lib/firebase/config";
import {IComment, ITopic} from "@/lib/interfaces";
import {getCommentAnswers, getComments, getTopic} from "@/lib/topic/utils";
import {ECategoryType, ETop, ETrendType} from "@/lib/enums";
import {Country} from "@/lib/types";
import {Simulate} from "react-dom/test-utils";
import copy = Simulate.copy;

function isUndefined(element: any): boolean {
    return typeof element === "undefined";
}

async function isUsernameAvailable(username: string): Promise<boolean> {
    const usersRef = collection(db, "users");
    const usernameQuery = query(usersRef, where("username", "==", username));

    const querySnapshot = await getDocs(usernameQuery);
    return querySnapshot.empty;
}

function calculateTopicPopularity(topic: ITopic): number {
    return 5 * topic.comments.length + 2 * topic.upVoted.length - topic.downVoted.length;
}

function quickSortTopics(array: ITopic[]): ITopic[] {
    if (array.length <= 1) {
        return array;
    }

    const pivotIndex = Math.floor(array.length / 2);
    const pivot = array[pivotIndex];
    const pivotPopularity = calculateTopicPopularity(pivot);
    const left = [];
    const right = [];

    for (let i = 0; i < array.length; i++) {
        if (i === pivotIndex) {
            continue;
        }

        const topic = array[i];
        const topicPopularity = calculateTopicPopularity(topic);

        if (topicPopularity > pivotPopularity) {
            left.push(array[i]);
        } else {
            right.push(array[i]);
        }
    }

    return [...quickSortTopics(left), pivot, ...quickSortTopics(right)];
}

function quickSortComments(array: IComment[]): IComment[] {
    if (array.length <= 1) {
        return array;
    }

    const pivotIndex = Math.floor(array.length / 2);
    const pivot = array[pivotIndex];
    const pivotCreationDate = pivot.creationDate.seconds;
    const left = [];
    const right = [];

    for (let i = 0; i < array.length; i++) {
        console.log(array[i].creationDate)
        console.log(array[i].body)

        if (i === pivotIndex) {
            continue;
        }

        const comment = array[i];
        const commentCreationDate = comment.creationDate.seconds;

        if (commentCreationDate > pivotCreationDate) {
            left.push(array[i]);
        } else {
            right.push(array[i]);
        }
    }

    return [...quickSortComments(left), pivot, ...quickSortComments(right)];
}

async function feedBuilder(category: ECategoryType, country: Country | undefined): Promise<ITopic[]> {
    const topics: ITopic[] = [];

    // Récupérer tous les topics
    const topicSnapshot = await getDocs(collection(db, "topics"));

    for (const snapshot of topicSnapshot.docs) {
        const topic = await getTopic(snapshot.id);

        if (!isUndefined(country) && (String(country) === ETop.All || topic.country === country)) {
            if (category === ECategoryType.All) {
                topics.push(topic);
            }

            if (topic.category === category) {
                topics.push(topic);
            }
        }

        if (isUndefined(country)) {
            if (category === ECategoryType.All) {
                topics.push(topic);
            }

            if (topic.category === category) {
                topics.push(topic);
            }
        }
    }

    // Classer les topics par tendance décroissante (Hot)
    return quickSortTopics(topics);
}

export {
    feedBuilder,
    isUsernameAvailable,
    isUndefined,
    quickSortComments,
}
