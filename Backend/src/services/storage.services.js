const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

async function uploadFile(buffer, fileName) {
    const result = await client.files.upload({
        // ImageKit SDK v7 expects a File-compatible value, not a raw Buffer.
        file: await toFile(buffer, fileName),
        fileName: fileName
    });

    return result;
}

module.exports = uploadFile;
