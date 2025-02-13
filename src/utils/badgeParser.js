var globalBadges = [];
var userBadges = [];

export default async function badgeParser(tags) {
  userBadges = [];

  if (globalBadges.length === 0) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/badges`, {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok) globalBadges = data.badges;
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch global badges:", error);
    }
  }

  if (!tags.badges) return [];

  Object.keys(tags.badges).forEach((key) => {
    const foundBadge = globalBadges.find((badge) => badge.id === key);
    if (foundBadge) {
      if (userBadges.length === 3) return;
      userBadges.push({
        title: foundBadge.title,
        url: foundBadge.url,
      });
    }
  });

  return userBadges;
}
