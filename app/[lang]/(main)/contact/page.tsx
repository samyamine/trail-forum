
export default function ContactPage() {
    return (
        <div className={`px-5 py-3`}>
            <h1 className={`py-5 text-2xl font-bold`}>
                Contact #COMPANY_NAME
            </h1>

            <div className={`flex flex-col gap-6`}>
                <p>
                    At #COMPANY_NAME, we make sure it is easy and fast to contact our team
                    and the responses we deliver are relevant. Use the following
                    details to send your message and get an answer within 24h.
                </p>

                <p>
                    If you have any kind of problem, please contact <br/>
                    <span className={`text-orange-500 underline cursor-pointer`}>support@#COMPANY_NAME.com</span>
                </p>

                <p>
                    For general questions, please contact<br/>
                    <span className={`text-orange-500 underline cursor-pointer`}>questions@#COMPANY_NAME.com</span>
                </p>

                <p>
                    Since we develop and maintain this platform with the aim to fully satisfy
                    you, we take your suggestions very carefully. If you have anything to
                    suggest to make #COMPANY_NAME better, please email us at&nbsp;
                    <span className={`text-orange-500 underline cursor-pointer`}>suggestions@#COMPANY_NAME.com</span>
                </p>
            </div>

        </div>
    );
}