import {IComment, ITopic} from "@/lib/interfaces";
import {EAfrica, EAsia, EEurope, ENorthAmerica, EOceania, ESouthAmerica} from "@/lib/enums";

export type Country = EEurope | EAfrica | ESouthAmerica | ENorthAmerica | EAsia | EOceania;

function isTopic(data: any): data is ITopic {
    return 'uid' in data && 'author' in data && 'body' in data
        && 'category' in data && 'comments' in data && 'creationDate' in data
        && 'title' in data && 'upVoted' in data && 'downVoted' in data;
}

function isComment(data: any): data is IComment {
    return 'uid' in data && 'answers' in data && 'author' in data && 'body' in data
        && 'creationDate' in data && 'parentComment' in data && 'topicRef' in data
        && 'upVoted' in data && 'downVoted' in data;
}

export {
    isComment,
    isTopic,
}
