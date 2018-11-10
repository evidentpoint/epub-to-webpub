import { PublicationParsePromise } from "r2-shared-js/dist/es8-es2017/src/parser/publication-parser";
import * as fs from "fs";
import * as path from "path";
import { JSON as TAJSON } from "ta-json-x";

const saveManifestJSON = async (inputPath: string, outputPath?: string) => {
    const publication = await PublicationParsePromise(inputPath)
        .catch((err) => {
            console.log("Error when parsing publication")
            console.log(err);
            process.exit(1);
        });
    const stringified = JSON.stringify(TAJSON.serialize(publication), null, 4) + "\n";

    outputPath = outputPath || "./manifest.json";

    fs.writeFile(outputPath, stringified, (err) => {
        if (err) {
            console.log("Error when writeFile");
            return console.log(err);
        }

        console.log("Saved at location: " + outputPath);
    });
};

// Taken from server-cli.ts within r2-streamer-js module
const args = process.argv.slice(2);
if (!args) {
    console.log("FILEPATH ARGUMENT IS MISSING.");
    process.exit(1);
}
let filePath = args[0].trim();

if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, filePath);
    console.log(`path: ${filePath}`);

    if (!fs.existsSync(filePath)) {
        filePath = path.join(process.cwd(), filePath);
        console.log(`path: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            console.log("FILEPATH DOES NOT EXIST.");
            process.exit(1);
        }
    }
}

const outputArgs = process.argv.slice(3);
const fileOutputPath = (outputArgs[0] || "").trim();

filePath = fs.realpathSync(filePath);
console.log("Input path: " + filePath);
saveManifestJSON(filePath, fileOutputPath)
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
