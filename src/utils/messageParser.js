var sevenTvEmotes = [];

export function setSevenTvEmotes(emotes) {
  sevenTvEmotes = emotes;
}

export default function messageParser(message) {
  var fragments = message.split(" ");
  var parsedFragments = [];

  const escapeHTML = (str) => str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");



  for (var FRAGMENT of fragments) {
    var fragment = escapeHTML(FRAGMENT)
    if (fragment.startsWith("@")) {
      parsedFragments.push(`<b>${FRAGMENT}</b>`);
      continue;
    }

    if (sevenTvEmotes.length > 0) {
      var emote = sevenTvEmotes.find((emote) => emote.name === fragment);
      if (emote) {
        console.log("Found emote: " + emote.name);
        parsedFragments.push(`<img class="h-6 mx-1" src="https:${emote.data.host.url}/4x.webp" alt="${emote.name}" />`);
        continue;
      }
    }

    parsedFragments.push(`${fragment}`);
  }

  return parsedFragments.join(" ");
}
