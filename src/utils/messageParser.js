var sevenTvEmotes = [];

export function setSevenTvEmotes(emotes) {
  sevenTvEmotes = emotes;
}

export default function messageParser(message) {
  // Escape HTML function
  const escapeHTML = (str) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Tokenize message while preserving delimiters
  const tokens = message.match(/(@\w+|\S+)/g) || [];

  return tokens
    .map((token) => {
      const escapedToken = escapeHTML(token);

      // Check for mentions
      if (token.startsWith("@")) {
        return `<b class="mx-1">${escapedToken}</b>`;
      }

      // Check for emotes
      const emote = sevenTvEmotes.find((e) => e.name === token);
      if (emote) {
        return `<img class="h-6 mx-1" src="https:${emote.data.host.url}/4x.webp" alt="${emote.name}" />`;
      }

      return escapedToken;
    })
    .join(" ");
}
