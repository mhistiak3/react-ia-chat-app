import Attachment from "./svg/Attachment";
const MessageForm = ({ handleSumit, text, setText, setImage }) => {
  return (
    <div>
      <form className="message_form" onSubmit={(e) => handleSumit(e)}>
        <label htmlFor="image">
          <Attachment />
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => setImage(e.target.files[0])}
        />
        <div>
          <input
            type="text"
            placeholder="Write your Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div>
          <button className="btn">Send</button>
        </div>
      </form>
    </div>
  );
};

export default MessageForm;
