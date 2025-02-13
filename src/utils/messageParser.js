var sevenTvEmotes = [];

export function setSevenTvEmotes(emotes) {
  sevenTvEmotes = emotes;
}

export default function messageParser(message, tags) {
  // Escape HTML function
  const escapeHTML = (str) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Parse Twitch emotes from tags["emotes-raw"]
  const twitchEmotes = {};
  if (tags["emotes-raw"]) {
    tags["emotes-raw"].split("/").forEach((emoteData) => {
      const [id, positions] = emoteData.split(":");
      positions.split(",").forEach((pos) => {
        const [start, end] = pos.split("-").map(Number);
        twitchEmotes[start] = { id, end };
      });
    });
  }

  // Tokenize message while preserving delimiters
  const tokens = message.match(/(@\w+|\S+)/g) || [];
  let result = "";
  let i = 0;

  while (i < message.length) {
    if (twitchEmotes[i]) {
      const { id, end } = twitchEmotes[i];
      const emoteHtml = `<img class="h-6 mx-1" src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/3.0" alt="emote" />`;
      result += emoteHtml;
      i = end + 1; // Move past the emote
    } else {
      let tokenFound = false;
      for (const emote of sevenTvEmotes) {
        if (message.startsWith(emote.name, i)) {
          result += `<img class="h-6 mx-1" src="https:${emote.data.host.url}/4x.webp" alt="${emote.name}" />`;
          i += emote.name.length;
          tokenFound = true;
          break;
        }
      }
      if (!tokenFound) {
        result += escapeHTML(message[i]);
        i++;
      }
    }
  }

  return result;
}
