var sevenTvEmotes = [];

export function setSevenTvEmotes(emotes) {
  sevenTvEmotes.splice(0, sevenTvEmotes.length, ...emotes);
}

export default function messageParser(message, tags) {
  // Escape HTML function
  const escapeHTML = (str) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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

  const messageClear = escapeHTML(message).split(" ");
  const completeMessage = [];

  for (const FRAGMENT of messageClear) {
    if (FRAGMENT.startsWith("@")) {
      completeMessage.push(`<b>${FRAGMENT}</b>`);
      continue;
    }

    const emote = sevenTvEmotes.find((e) => e.name === FRAGMENT);
    if (emote) {
      completeMessage.push(
        `<img class="h-6 mx-1" src="https://${emote.data.host.url}/4x.webp" alt="${emote.name}" />`
      );
      continue;
    }

    let foundTwitchEmote = false;
    Object.keys(twitchEmotes).forEach((start) => {
      const emote = twitchEmotes[start];
      if (message.substring(start, emote.end + 1) === FRAGMENT) {
        completeMessage.push(
          `<img class="h-6 mx-1" src="https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/3.0" alt="${emote.id}" />`
        );
        foundTwitchEmote = true;
      }
    });
    if (foundTwitchEmote) continue;
    completeMessage.push(FRAGMENT);
  }

  return completeMessage.join(" ");
}
