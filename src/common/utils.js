module.exports = {
    shuffle: function (array) {
        // https://stackoverflow.com/a/2450976
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },
    arrayRotate: function (arr, reverse) {
        // https://stackoverflow.com/a/23368052
        if (reverse) arr.unshift(arr.pop());
        else arr.push(arr.shift());
        return arr;
    },
    validateUsername: function (name) {
        name = name.trim();
        const minChars = 1;
        const maxChars = 20;
        let regex = new RegExp(`^[0-9a-zA-Z ]{${minChars},${maxChars}}$`);
        return name.match(regex);
    },
    randomInt: function (max) { // max-exclusive
        return Math.floor(Math.random() * max);
    }
};