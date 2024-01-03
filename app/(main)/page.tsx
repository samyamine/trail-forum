"use client";

import TopicTile from "@/components/TopicTile";
import Divider from "@/components/Divider";
import { FaPlus } from "react-icons/fa6";
import {LiaAngleDownSolid, LiaAngleUpSolid} from "react-icons/lia";
import {useState} from "react";


enum ESelector {
    Category,
    Location,
}

function SignInPopup() {
    return (
        <div>
            POPUP
        </div>
    );
}

export default function Home() {
    const [categorySelect, setCategorySelect] = useState(false);
    const [locationSelect, setLocationSelect] = useState(false);
    const [showSignIn, setShowSignIn] = useState(false);

    const toggleCategorySelector = (): void => {
        if (!categorySelect && locationSelect) {
            setLocationSelect(false);
            setCategorySelect(true);
        }
        else {
            setCategorySelect(!categorySelect);
        }
    };

    const toggleLocationSelector = (): void => {
        if (!locationSelect && categorySelect) {
            setCategorySelect(false);
            setLocationSelect(true);
        }
        else {
            setLocationSelect(!locationSelect);
        }
    };


  return (
      <main>
          <div className={`w-full mt-16 overflow-y-auto`}>
              <div className={`md:w-1/2 w-full px-5 py-3`}>
                  {/*New topic bar*/}
                  <div className={`w-full flex justify-between md:justify-start md:gap-5 items-center`}>
                      <div className={`w-fit px-3 py-1 flex items-center gap-2 bg-orange-500 rounded-sm shadow-md active:shadow-sm text-white text-sm`}>
                          <FaPlus />
                          <p>New Topic</p>
                      </div>

                      <div className={`flex gap-3 text-xs`}>
                          <div className={`relative flex items-center gap-1 cursor-pointer`} onClick={toggleCategorySelector}>
                              <div className={`flex items-center gap-1`}>
                                  <p>Hot</p>
                                  {categorySelect ? (
                                      <LiaAngleUpSolid />
                                  ) : (
                                      <LiaAngleDownSolid />
                                  )}
                              </div>

                              <div className={`${!categorySelect && " hidden"} min-w-max p-3 shadow-md bg-white absolute top-5 left-0 flex flex-col gap-3`}>
                                  <p>Hot</p>
                                  <p>Latest</p>
                                  <p>News</p>
                                  <p>Others</p>
                              </div>
                          </div>

                          <div className={`cursor-pointer relative`} onClick={toggleLocationSelector}>
                              <div className={`flex items-center gap-1`}>
                                  <p>Everywhere</p>
                                  {locationSelect ? (
                                      <LiaAngleUpSolid />
                                  ) : (
                                      <LiaAngleDownSolid />
                                  )}
                              </div>

                              <div className={`${!locationSelect && " hidden"} max-h-48 min-w-max p-3 shadow-md bg-white 
                              absolute top-5 right-0 flex flex-col gap-3 overflow-y-auto`}>
                                  <p>France</p>
                                  <p>United-Kingdom</p>
                                  <p>Spain</p>
                                  <p>Germany</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <Divider />
              <div className={`flex`}>
                  {/*Categories feed*/}
                  <div className={`max-md:hidden w-1/4 border-r-[1px] border-black`}>
                      HEY
                  </div>

                  {/*Main topics feed*/}
                  <div className={`w-full  md:w-3/4 lg:mx-10 flex flex-col items-center overflow-y-auto`}>
                      <TopicTile />
                      <Divider />
                      <TopicTile />
                      <Divider />
                      <TopicTile />
                      <Divider />
                      <TopicTile />
                      <Divider />
                      <TopicTile />
                      <Divider />
                      <TopicTile />
                      <Divider />
                  </div>
              </div>
          </div>

        {/*Last News*/}
      </main>
  )
}
