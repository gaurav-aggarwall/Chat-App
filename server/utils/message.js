const msgGenerator = (from, text) => {
    return {
        from,
        text,
        createdAt: new Date().getTime()
    }
}

const msgLocGenerator = (from, coords) => {
    return {
        from,
        url: `https://www.google.com/maps/@${coords.lat},${coords.lng},15z`,
        createdAt: new Date().getTime()
    }
}

module.exports = {msgGenerator, msgLocGenerator};