// Given a collection of maps, return a map title
export const selectMap = (maps, mapTitle) => {
	// Go through each map until titles match
	for (let i = 0; i < maps.length; i++) {
		if(maps[i]["title"] == mapTitle) {
			return maps[i];
		}
	}
	return null;
}
