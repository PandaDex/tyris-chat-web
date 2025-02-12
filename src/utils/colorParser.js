var safeColors = ["#D900FF", "#8A2BE2", "#9ACD32", "#5B99FF", "#FF0000"];
var nullPeopleColors = [];

export default function colorParser(tags) {
  if (nullPeopleColors.map((x) => x.username).includes(tags.username))
    return nullPeopleColors.find((x) => x.username === tags.username).color;

  if (tags.color == null || tags.color === "000000") {
    var pickedColor = safeColors[Math.floor(Math.random() * safeColors.length)];
    nullPeopleColors.push({ username: tags.username, color: pickedColor });
    return pickedColor;
  }

  return tags.color;
}
