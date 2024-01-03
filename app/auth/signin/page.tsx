import { FcGoogle } from "react-icons/fc";
import Link from "next/link";



export default function SignIn() {
    return (
        <div className={`mt-36 flex flex-col items-center`}>
            <div className={`w-1/2 md:w-[400px] px-5 py-2 rounded-lg border-[1px] border-black flex 
            justify-center items-center gap-5 cursor-pointer text-xl`}>
                <FcGoogle />

                <p className={`text-base`}>
                    Continue with Google
                </p>
            </div>

            <div className={`w-1/2 md:w-[400px] my-5 flex justify-between items-center`}>
                <div className={`w-1/2 h-[1px] mr-3 bg-black`}></div>
                Or
                <div className={`w-1/2 h-[1px] ml-3 bg-black`}></div>
            </div>

            <div className={`w-1/2 md:w-[400px] mb-10 flex flex-col items-center gap-5`}>
                <input type={`text`} className={`w-full px-4 py-2 bg-gray-100 rounded-lg
                border-[1px] border-gray-400 text-sm placeholder-gray-400`} placeholder={`Username or email`}/>

                <input type={`password`} className={`w-full px-4 py-2 bg-gray-100 rounded-lg
                border-[1px] border-gray-400 text-sm placeholder-gray-400`} placeholder={`Password`}/>
            </div>


            <div className={`px-5 py-2 mb-5 rounded-lg bg-orange-500 text-white cursor-pointer`}>
                Sign In
            </div>

            <div className={`flex gap-1 text-sm`}>
                <p>
                    Don't have an account ?
                </p>
                <Link href={`/auth/register`}>
                    <div className={`text-orange-500 underline`}>
                        Register
                    </div>
                </Link>
            </div>
        </div>
    );
}