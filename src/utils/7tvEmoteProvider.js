var sevenTvEndpoint = "https://7tv.io/v3";
var streamerId = import.meta.env.VITE_STREAMER_ID;

const fetchEmotesByTwitchId = async (id) => {
	try {
		const response = await fetch(`${sevenTvEndpoint}/users/twitch/${id}`, {
			method: "GET",
		});
		const data = await response.json();
		return [data.emote_set.emotes, null];
	} catch (error) {
		return [[], error];
	}
};

export { fetchEmotesByTwitchId, streamerId };

