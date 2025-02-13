import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ChatMessage from "~/components/ChatMessage";
import colorParser from "~/utils/colorParser";
import badgeParser from "~/utils/badgeParser";
import messageParser, { setSevenTvEmotes } from "~/utils/messageParser";
import { fetchEmotesByTwitchId, streamerId } from "~/utils/7tvEmoteProvider";
import tmi from "tmi.js";

function Chat() {
  const { channelName } = useParams();
  const [messages, setMessages] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const chatRef = useRef(null);
  var cachedAvatars = [];

  useEffect(() => {
    const client = new tmi.Client({
      options: { debug: true },
      channels: [channelName],
    });

    client.on("connecting", () => {
      console.log("connecting");
    });

    client.on("connected", async () => {
      console.log(`connected`);

      var blockedUsers = JSON.parse(localStorage.getItem("blockedUsers")) || [];
      setBlockedUsers(blockedUsers);

      var [data, error] = await fetchEmotesByTwitchId(streamerId);
      if (error === null) setSevenTvEmotes(data);
    });

    client.on("messagedeleted", (channel, tags, message) => {
      setMessages([]);
    });

    client.on("clearchat", (channel, tags, message) => {
      setMessages([]);
    });

    client.on("message", async (channel, tags, message) => {
      if (message.startsWith("!block")) {
        if (!tags.mod) return;
        var args = message.split(" ");
        var username = args[1].toLowerCase();
        if (username.startsWith("@")) username = username.slice(1);
        var temp = blockedUsers;
        temp.push(username);
        localStorage.setItem("blockedUsers", JSON.stringify(temp));
        setBlockedUsers(temp);
        return;
      }

      if (message.startsWith("!clear")) {
        if (!tags.mod) return;
        setMessages([]);
        return;
      }

      if (message.startsWith("!emote")) {
        if (!tags.mod) return;
        var [data, error] = await fetchEmotesByTwitchId(streamerId);
        if (error === null) setSevenTvEmotes(data);
        return;
      }

      if (message.startsWith("!unblock")) {
        if (!tags.mod) return;
        var args = message.split(" ");
        var username = args[1].toLowerCase();
        if (username.startsWith("@")) username = username.slice(1);
        var temp = blockedUsers;
        temp.splice(temp.indexOf(username), 1);
        localStorage.setItem("blockedUsers", JSON.stringify(temp));
        setBlockedUsers(temp);
        return;
      }

      if (blockedUsers.includes(tags.username)) return;

      var badges = await badgeParser(tags);

      if (tags.subscriber !== true) {
        setMessages((prev) => {
          const newMessages = [
            ...prev,
            {
              message: messageParser(message, tags),
              tags: {
                username: tags.username,
                avatar: "https://i.imgur.com/4X2vyND.png",
                color: colorParser(tags),
                badges: badges,
              },
            },
          ];
          return newMessages.slice(-15);
        });
        return;
      }
      if (cachedAvatars.map((x) => x.id).includes(tags["user-id"])) {
        setMessages((prev) => {
          const newMessages = [
            ...prev,
            {
              message: messageParser(message, tags),
              tags: {
                username: tags.username,
                avatar: cachedAvatars.find((x) => x.id === tags["user-id"]).url,
                color: colorParser(tags),
                badges: badges,
              },
            },
          ];
          return newMessages.slice(-15);
        });
      } else {
        await fetch(`${import.meta.env.VITE_API}/user/${tags["user-id"]}`, {
          method: "GET",
        })
          .then((response) => response.json())
          .then(async (data) => {
            cachedAvatars.push({
              id: tags["user-id"],
              url: data.avatar,
            });
            setMessages((prev) => {
              const newMessages = [
                ...prev,
                {
                  message: messageParser(message, tags),
                  tags: {
                    username: tags.username,
                    avatar: data.avatar,
                    color: colorParser(tags),
                    badges: badges,
                  },
                },
              ];
              return newMessages.slice(-15);
            });
          });
      }
    });
    client.connect();

    setInterval(() => {
      if (chatRef.current) {
        chatRef.current.scrollTo(0, chatRef.current.scrollHeight);
      }
    }, 300);
  }, [channelName]);
  return (
    <div
      ref={chatRef}
      className="p-4 flex flex-col gap-4 w-full h-full overflow-scroll overflow-x-hidden"
    >
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          chatterData={{
            username: message.tags.username,
            message: message.message,
            avatar: message.tags["avatar"],
            badges: message.tags["badges"],
            usernameColor: message.tags["color"],
          }}
        />
      ))}
    </div>
  );
}

export default Chat;
