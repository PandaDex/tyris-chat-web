function ChatMessage({
  chatterData = {
    username: "username",
    message: "message",
    avatar: "https://dummyimage.com/48.png",
    badges: [],
    usernameColor: "#fff",
  },
}) {
  console.log(chatterData.badges);
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
          <div className="flex flex-row ml-2 items-center bg-black px-1 chuj-jebać-firefox py-0.5 rounded-md gap-1">
            {chatterData.badges &&
              chatterData.badges.map((badge, index) => (
                <img
                  key={index}
                  className="h-[16px] w-[16px] select-none"
                  draggable="false"
                  src={badge.url}
                />
              ))}
          </div>
        </span>
        <p className="text-sm w-fit max-w-[300px] text-wrap py-1 mt-1 px-2 chuj-jebać-firefox bg-black rounded-lg text-white">
          {chatterData.message}
        </p>
      </div>
    </span>
  );
}

export default ChatMessage;
