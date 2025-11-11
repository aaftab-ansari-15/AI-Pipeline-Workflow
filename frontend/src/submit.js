import submitPipeline from "./submitPipeline";

export const SubmitButton = () => {
    return (
        <div className="fixed bottom-0 left-0 w-full flex justify-center items-center p-4 bg-gradient-to-br from-[#1e0d4b] to-[#2a117a]">
            <button
                type="submit"
                onClick={submitPipeline}
                className="px-6 py-2 rounded-xl text-lg font-bold text-gray-700 bg-gray-200 border border-gray-700 shadow-md hover:bg-gray-800 hover:text-gray-200 transition-all duration-300 ease-out"
            >
                Submit
            </button>
        </div>
    );
};
