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
      if (message.startsWith("!hide")) {
        if (!tags?.mod && tags?.badges?.broadcaster !== "1") return;
        var args = message.split(" ");
        var username = args[1].toLowerCase();
        if (username.startsWith("@")) username = username.slice(1);
        var temp = blockedUsers;
        temp.push(username);
        localStorage.setItem("blockedUsers", JSON.stringify(temp));
        setBlockedUsers(temp);
        return;
      }

      if (message.startsWith("!emote")) {
        if (!tags?.mod && tags?.badges?.broadcaster !== "1") return;
        var [data, error] = await fetchEmotesByTwitchId(streamerId);
        if (error === null) setSevenTvEmotes(data);
        return;
      }

      if (message.startsWith("!show")) {
        if (!tags?.mod && tags?.badges?.broadcaster !== "1") return;
        var args = message.split(" ");
        var username = args[1].toLowerCase();
        if (username.startsWith("@")) username = username.slice(1);
        var temp = blockedUsers;
        temp.splice(temp.indexOf(username), 1);
        localStorage.setItem("blockedUsers", JSON.stringify(temp));
        setBlockedUsers(temp);
        return;
      }

      if (message.startsWith("!clearCache")) {
        if (!tags?.mod && tags?.badges?.broadcaster !== "1") return;
        cachedAvatars = [];
        return;
      }

      if (message.startsWith("!clear")) {
        if (!tags?.mod && tags?.badges?.broadcaster !== "1") return;
        setMessages([]);
        return;
      }

      if (blockedUsers.includes(tags.username)) return;

      var badges = await badgeParser(tags);

      if (
        tags?.subscriber !== true &&
        tags?.mod !== true &&
        tags?.vip !== true &&
        tags?.badges?.broadcaster !== "1"
      ) {
        displayMessage(
          message,
          tags,
          badges,
          "https://i.imgur.com/4X2vyND.png"
        );
        return;
      }
      if (cachedAvatars.map((x) => x.id).includes(tags["user-id"])) {
        displayMessage(
          message,
          tags,
          badges,
          cachedAvatars.find((x) => x.id === tags["user-id"]).url
        );
        return;
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
            displayMessage(message, tags, badges, data.avatar);
          });
        return;
      }
    });
    client.connect();

    setInterval(() => {
      if (chatRef.current) {
        chatRef.current.scrollTo(0, chatRef.current.scrollHeight);
      }
    }, 300);
  }, [channelName]);

  const displayMessage = (message, tags, badges, data) => {
    setMessages((prev) => {
      const newMessages = [
        ...prev,
        {
          message: messageParser(message, tags),
          tags: {
            username: tags["display-name"],
            avatar: data,
            color: colorParser(tags),
            badges: badges,
          },
        },
      ];
      return newMessages.slice(-15);
    });
  };

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
