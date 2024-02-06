import {collection, DocumentReference, getDocs, query, where} from "@firebase/firestore";
import {db} from "@/lib/firebase/config";
import {IComment, ITopic} from "@/lib/interfaces";
import {getTopic} from "@/lib/topic/utils";
import {ECategoryType, ETop, ETrendType} from "@/lib/enums";
import {Country} from "@/lib/types";

function isUndefined(element: any): boolean {
    return typeof element === "undefined";
}

async function isUsernameAvailable(username: string): Promise<boolean> {
    const usersRef = collection(db, "users");
    const usernameQuery = query(usersRef, where("username", "==", username));

    const querySnapshot = await getDocs(usernameQuery);
    return querySnapshot.empty;
}

function quickSortTopics(arr: ITopic[]): ITopic[] {
    if (arr.length <= 1) {
        return arr;
    }

    const pivotIndex = Math.floor(arr.length / 2);
    const pivot = arr[pivotIndex];
    const pivotVotes = pivot.upVoted.length - pivot.downVoted.length;
    const left = [];
    const right = [];

    for (let i = 0; i < arr.length; i++) {
        if (i === pivotIndex) {
            continue;
        }

        const topic = arr[i];
        const topicVotes = topic.upVoted.length - topic.downVoted.length;

        if (topicVotes > pivotVotes) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
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
        const topicCreationDate = comment.creationDate.seconds;

        if (topicCreationDate > pivotCreationDate) {
            left.push(array[i]);
        } else {
            right.push(array[i]);
        }
    }

    return [...quickSortComments(left), pivot, ...quickSortComments(right)];
}

async function feedBuilder(category: ECategoryType, country: Country | undefined): Promise<ITopic[]> {
    const topics: ITopic[] = [];

    console.log(`COUNTRY: ${country}`)

    // Récupérer tous les topics
    const topicSnapshot = await getDocs(collection(db, "topics"));

    for (const snapshot of topicSnapshot.docs) {
        const topic = await getTopic(snapshot.id);

        if (!isUndefined(country) && (String(country) === ETop.All || topic.country === country)) {
            console.log("NOT undefined")
            if (category === ECategoryType.All) {
                topics.push(topic);
            }

            if (topic.category === category) {
                topics.push(topic);
            }
        }

        if (isUndefined(country)) {
            console.log("Undefined")
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
