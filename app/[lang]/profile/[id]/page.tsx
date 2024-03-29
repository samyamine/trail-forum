"use client";

import React, {useEffect, useState} from "react";
import {useAuth} from "@/app/[lang]/authContext";
import IconTextButton from "@/components/IconTextButton";
import TopicTile from "@/components/TopicTile";
import Divider from "@/components/Divider";
import CommentTile from "@/components/CommentTile";
import {IComment, ITopic, IUser} from "@/lib/interfaces";
import toast, {Toaster} from "react-hot-toast";
import {isUndefined} from "@/lib/utils";
import {isTopic} from "@/lib/types";
import {usePopup} from "@/app/[lang]/popupContext";
import AuthPopup from "@/components/AuthPopup";
import InitAccountPopup from "@/components/InitAccountPopup";
import {arrayRemove, arrayUnion, doc, DocumentReference, getDoc, updateDoc} from "@firebase/firestore";
import {db} from "@/lib/firebase/config";
import {getComments, getSaved, getTopic} from "@/lib/topic/utils";
import {FaMinus, FaPlus} from "react-icons/fa6";
import {getDictionary} from "@/lib/dictionary";
import SharePopup from "@/components/SharePopup";
import ProfilePictureLoading from "@/components/loading/ProfilePictureLoading";
import ProfilePicture from "@/components/ProfilePicture";
import IconTextButtonLoading from "@/components/loading/IconTextButtonLoading";
import TopicTileLoading from "@/components/loading/TopicTileLoading";
import DividerLoading from "@/components/loading/DividerLoading";
import {TbBookmark, TbMessageCircle} from "react-icons/tb";
import {GrArticle} from "react-icons/gr";

enum ETabs {
    Comments = "Comments",
    Saved = "Saved",
    Topics = "Topics",
}

interface IData {
    comments: IComment[],
    followers: DocumentReference[],
    following: DocumentReference[],
    saved: (IComment | ITopic)[],
    topics: ITopic[],
    username: string,
}

export default function ProfilePage({ params }: { params: { id: string, lang: string }}) {
    const {loading, userData} = useAuth();
    const {showAuthPopup, isInitAccountPopupVisible, isAuthPopupVisible, isSharePopupVisible} = usePopup();

    const [dictionary, setDictionary] = useState<any>();
    const [selectedTab, setSelectedTab] = useState(ETabs.Topics);
    const [following, setFollowing] = useState(false);
    const [profileData, setProfileData] = useState<IData>({
        comments: [],
        followers: [],
        following: [],
        saved: [],
        topics: [],
        username: "",
    });

    const isMyProfile = (): boolean => !isUndefined(userData) && userData?.uid === params.id;

    const isFollowing = () => {
        for (const ref of profileData.followers as DocumentReference[]) {
            if (ref.id === userData?.uid) {
                return true;
            }
        }

        return false;
    };

    // FIXME: Profile user not me
    const tabs = {
        [ETabs.Comments]: (
            <div>
                {profileData.comments.length === 0 ? (
                    <p className={`mt-5 text-center`}>
                        {/*FIXME: Translation (use a function that takes a dictionary and returns this UI*/}
                        Pas de résultats
                    </p>
                ) : (
                    <div>
                        {profileData.comments.map((comment, index) => (
                            <div key={index} className={`md:border-l-[1px] md:border-r-[1px] md:border-gray-900`}>
                                <CommentTile comment={comment} dictionary={dictionary} />
                                <Divider />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ),
        [ETabs.Saved]: (
            <div>
                {profileData.saved.length === 0 ? (
                    <p className={`mt-5 text-center`}>
                        {/*FIXME: Translation (use a function that takes a dictionary and returns this UI*/}
                        Pas de résultats
                    </p>
                ) : (
                    <div>
                        {profileData.saved.map((element, index) => (
                            <div key={index}>
                                {isTopic(element) ? (
                                    <TopicTile topic={element} dictionary={dictionary} />
                                ) : (
                                    <div className={`md:border-l-[1px] md:border-r-[1px] md:border-gray-900`}>
                                        <CommentTile comment={element} dictionary={dictionary} />
                                    </div>
                                )}
                                <Divider />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ),
        [ETabs.Topics]: (
            <div>
                {profileData.topics.length === 0 ? (
                    <p className={`mt-5 text-center`}>
                        {/*FIXME: Translation (use a function that takes a dictionary and returns this UI*/}
                        Pas de résultats
                    </p>
                ) : (
                    <div>
                        {profileData.topics.map((topic, index) => (
                            <div key={index}>
                                <TopicTile topic={topic} dictionary={dictionary} />
                                <Divider />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ),
    };

    // FIXME
    const handleFollow = async (startFollowing: boolean) => {
        if (isUndefined(userData)) {
            showAuthPopup();
        }
        else {
            const profileUserRef = doc(db, "users", params.id);
            const userRef = doc(db, "users", String(userData?.uid));

            await updateDoc(profileUserRef, {
                followers: startFollowing ? arrayUnion(userRef) : arrayRemove(userRef),
            });

            await updateDoc(userRef, {
                following: startFollowing ? arrayUnion(profileUserRef) : arrayRemove(profileUserRef),
            });
        }
    };

    useEffect(() => {
        // FIXME: Init user profile
        console.log("useEffect profile")
        console.log(userData)
        const initData = async () => {
            const profileUserRef = doc(db, "users", params.id);
            const profileUserSnapshot = await getDoc(profileUserRef);

            if (!profileUserSnapshot.exists()) {
                toast.error("User does not exist");
            }
            else {
                const data = profileUserSnapshot.data();
                const saved = await getSaved(data.saved);
                const comments: IComment[] = await getComments(data.comments);
                const topics: ITopic[] = [];

                for (const ref of data.topics) {
                    const topic = await getTopic(ref.id);
                    topics.push(topic);
                }

                for (const ref of data.followers) {
                    if (ref.id === params.id) {
                        setFollowing(true);
                    }
                }

                setProfileData({
                    comments,
                    followers: data.followers,
                    following: data.following,
                    saved,
                    topics,
                    username: data.username,
                });

                // setLoading(false);
            }
        };

        if (params.lang !== "fr" && params.lang !== "en") {
            throw new Error(`Language ${params.lang} is not supported`);
        }

        getDictionary(params.lang).then((dict) => {
            setDictionary(dict);
        });

        initData().catch((error) => toast.error(error.message));
    }, [userData]);

    return (
        <>
            {/*Signin popup*/}
            {isAuthPopupVisible && (
                <AuthPopup dictionary={dictionary} />
            )}

            {/*Create username popup*/}
            {isInitAccountPopupVisible && (
                <InitAccountPopup dictionary={dictionary} />
            )}

            {isSharePopupVisible && (
                <SharePopup dictionary={dictionary} />
            )}

            <Toaster toastOptions={{ duration: 3000 }} />


            {loading || isUndefined(dictionary) ? (
                <div className={`w-full flex flex-col animate-pulse`}>
                    {/*Profile header*/}
                    <div className={`px-5 py-3`}>
                        <div className={`flex items-center gap-5`}>
                            <div className={`w-12 h-12`}>
                                <ProfilePictureLoading />
                            </div>

                            <div className={`flex flex-col justify-between`}>
                                <div className={`w-[100px] h-4 bg-gray-200`}></div>

                                <div className={`mt-2 flex items-center gap-5 text-xs`}>
                                    <div className={`w-[70px] h-3 bg-gray-200`}></div>
                                    <div className={`w-[70px] h-3 bg-gray-200`}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!isMyProfile() && (
                        <div className={`px-5`}>
                            <IconTextButtonLoading />
                        </div>
                    )}

                    <div className={`mt-2 flex justify-between items-center border-b-[1px] border-gray-200`}>
                        <div className={`${isMyProfile() ? "w-1/3" : "w-1/2" } py-1 flex justify-center items-center`}>
                            <div className={`w-[70px] h-5 bg-gray-200`}></div>
                        </div>

                        <div className={`${isMyProfile() ? "w-1/3" : "w-1/2" } py-1 flex justify-center items-center`}>
                            <div className={`w-[70px] h-5 bg-gray-200`}></div>
                        </div>

                        {/*FIXME*/}
                        {isMyProfile() && (
                            <div className={`${isMyProfile() ? "w-1/3" : "w-1/2" } py-1 flex justify-center items-center`}>
                                <div className={`w-[70px] h-5 bg-gray-200`}></div>
                            </div>
                        )}
                    </div>

                    <div className={`w-full flex flex-col items-center`}>
                        <div className={`w-full md:w-2/3 lg:w-1/2`}>
                            <TopicTileLoading />
                            <DividerLoading />
                            <TopicTileLoading />
                            <DividerLoading />
                            <TopicTileLoading />
                            <DividerLoading />
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`w-full flex flex-col`}>
                    {/*Profile header*/}
                    <div className={`px-5 py-3`}>
                        <div className={`flex items-center gap-5`}>
                            <div className={`w-12 h-12`}>
                                {/*FIXME: Implement Profile Picture*/}
                                <ProfilePicture />
                            </div>

                            <div className={`flex flex-col justify-between`}>
                                <h1 className={`text-lg font-bold`}>
                                    {profileData.username}
                                </h1>

                                <div className={`flex items-center gap-5 text-xs`}>
                                    <p>
                                        {profileData.followers.length} {dictionary.profile.followers}
                                    </p>

                                    <p>
                                        {profileData.following.length} {dictionary.profile.following}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!isMyProfile() && (
                        <div className={`px-5`} onClick={() => handleFollow(!isFollowing()).catch((error) => toast.error(error.message))}>
                            {isFollowing() ? (
                                <div className={`w-fit px-3 py-1 flex items-center gap-2 bg-gray-200 rounded-sm 
                                active:bg-gray-100 text-black text-sm cursor-pointer`}>
                                    <FaMinus />
                                    <p>{dictionary.profile.unfollow}</p>
                                </div>
                            ) : (
                                <IconTextButton text={dictionary.profile.follow} />
                            )}
                        </div>
                    )}

                    <div className={`mt-2 flex justify-between items-center border-b-[1px] border-gray-200`}>
                        <div className={`${isMyProfile() ? "w-1/3" : "w-1/2" } py-1 flex justify-center gap-2 items-center active:bg-gray-100 hover:bg-gray-100 
                        cursor-pointer text-lg ${selectedTab === ETabs.Topics && "text-orange-500 border-b-[1px] border-orange-500"}`}
                             onClick={() => setSelectedTab(ETabs.Topics)}>
                            <GrArticle />

                            <p className={`text-xs`}>
                                {dictionary.profile.topics}
                            </p>
                        </div>

                        <div className={`${isMyProfile() ? "w-1/3" : "w-1/2" } py-1 flex justify-center gap-2 items-center active:bg-gray-100 hover:bg-gray-100 
                        cursor-pointer text-lg ${selectedTab === ETabs.Comments && "text-orange-500 border-b-[1px] border-orange-500"}`}
                             onClick={() => setSelectedTab(ETabs.Comments)}>
                            <TbMessageCircle />

                            <p className={`text-xs`}>
                                {dictionary.profile.comments}
                            </p>
                        </div>

                        {/*FIXME*/}
                        {isMyProfile() && (
                            <div className={`w-1/3 py-1 flex justify-center gap-2 items-center active:bg-gray-100 hover:bg-gray-100 
                            cursor-pointer text-lg ${selectedTab === ETabs.Saved && "text-orange-500 border-b-[1px] border-orange-500"}`}
                                 onClick={() => setSelectedTab(ETabs.Saved)}>
                                <TbBookmark />

                                <p className={`text-xs`}>
                                    {dictionary.profile.saved}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className={`w-full flex flex-col items-center`}>
                        <div className={`w-full md:w-2/3 lg:w-1/2`}>
                            {tabs[selectedTab]}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}