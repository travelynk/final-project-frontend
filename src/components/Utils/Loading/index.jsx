import { Progress } from "../../ui/progress";

const Loading = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full gap-2 text-gray-500 font-semibold ">
        <h1>Mencari Penerbangan terbaik</h1>
        <span>Loading...</span>

        <div className="w-1/2">
          <Progress value={65} />
        </div>
      </div>
    </>
  );
};

export default Loading;