import {EAfrica, EAsia, ECategoryType, EEurope, ENorthAmerica, EOceania, ESouthAmerica} from "@/lib/enums";
import {IDict} from "@/lib/interfaces";

const topicTypeColor: IDict = {
    Discussion: "bg-blue-500",
    Gear: "bg-cyan-400",
    Live: "bg-red-400",
    News: "bg-yellow-500",
    Races: "bg-green-400",
    Training: "bg-purple-400",
};

const allCountries: IDict = {
    ...EAfrica,
    ...EAsia,
    ...EEurope,
    ...ENorthAmerica,
    ...ESouthAmerica,
    ...EOceania
};

export {
    allCountries,
    topicTypeColor,
}
