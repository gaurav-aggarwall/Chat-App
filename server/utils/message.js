const moment = require('moment');

const msgGenerator = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
}

const msgLocGenerator = (from, coords) => {
    return {
        from,
        url: `https://www.google.com/maps/@${coords.lat},${coords.lng},15z`,
        createdAt: moment().valueOf()
    }
}

module.exports = {msgGenerator, msgLocGenerator};