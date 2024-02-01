import {collection, getDocs, query, where} from "@firebase/firestore";
import {db} from "@/lib/firebase/config";
import {ITopic} from "@/lib/interfaces";
import {getTopic} from "@/lib/topic/utils";

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

async function feedBuilder(): Promise<ITopic[]> {
    const topics: ITopic[] = [];

    // Récupérer tous les topics
    const topicSnapshot = await getDocs(collection(db, "topics"));

    for (const snapshot of topicSnapshot.docs) {
        const topic = await getTopic(snapshot.id);

        topics.push(topic);
    }

    // Classer les topics par tendance décroissante (Hot)
    return quickSortTopics(topics);
}

export {
    feedBuilder,
    isUsernameAvailable,
    isUndefined,
}
