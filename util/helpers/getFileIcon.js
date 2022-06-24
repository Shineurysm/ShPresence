const vscode = require('vscode')
const { KNOWN_EXTENSIONS } = require('../data/languages.json')


const getFileIcon = (name) => {
    return "https://raw.githubusercontent.com/Shineurysm/discord-coding-presence/main/icons/small_image/".concat(name, ".png")
};


const resolveFileIcon = (document) => {
    const filename = document

    const findKnownExtension = Object.keys(KNOWN_EXTENSIONS).find(function (key) {
        if (filename.endsWith(key)) {
            return true;
        };

        const match = /^\/(.*)\/([mgiy]+)$/.exec(key);
        if (!match) return false;

        const reg = new RegExp(match[1], match[2]);
        return reg.test(filename);

    });

    const knownExtension = findKnownExtension ? KNOWN_EXTENSIONS[findKnownExtension] : null;

    let fileIcon = knownExtension;
    let tempVariable;

    return typeof fileIcon === 'string' ? fileIcon : (tempVariable = fileIcon === null || fileIcon === undefined ? undefined : fileIcon.image) !== null && tempVariable !== undefined ? tempVariable : 'text';
}

const getIcon = (doc) => {
    return getFileIcon(resolveFileIcon(doc))
}

console.log(getIcon)

module.exports = {
    getIcon: getIcon
}



