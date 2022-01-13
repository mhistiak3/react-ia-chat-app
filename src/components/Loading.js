import Loader from "react-js-loader";
const Loading = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loader type="bubble-top" bgColor={"#D980FA"} size={300} />
    </div>
  );
};

export default Loading;
