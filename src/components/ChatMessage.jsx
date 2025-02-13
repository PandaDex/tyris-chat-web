function ChatMessage({
  chatterData = {
    username: "username",
    message: "message",
    avatar: "https://dummyimage.com/48.png",
    badges: [],
    usernameColor: "#fff",
  },
}) {
  return (
    <span className="flex flex-row">
      <img
        className="rounded-full !w-10 !h-10 mr-2"
        src={chatterData.avatar}
        alt={chatterData.username}
      />
      <div>
        <span className="flex flex-row">
          <h1
            style={{ color: chatterData.usernameColor }}
            className="font-semibold text-base drop-shadow-sm"
          >
            {chatterData.username}
          </h1>
          <div className="flex flex-row ml-2 items-center bg-black chuj-jebać-firefox px-1 py-0.5 rounded-md gap-1">
            {chatterData.badges !== null &&
              chatterData.badges?.map((badge, index) => (
                <img
                  key={index}
                  className="h-[16px] w-[16px] select-none"
                  draggable="false"
                  src={badge.url}
                  alt="badge"
                />
              ))}
          </div>
        </span>
        <p
          dangerouslySetInnerHTML={{
            __html: chatterData.message,
          }}
          className="flex flex-wrap break-all whitespace-pre-wrap items-center chuj-jebać-firefox  text-sm w-fit max-w-[300px] py-1 mt-1 px-2 bg-black rounded-lg text-white"
        />
      </div>
    </span>
  );
}

export default ChatMessage;
