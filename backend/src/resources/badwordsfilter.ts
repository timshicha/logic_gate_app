
import fs from "fs";
import path from "path";
import { fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const badwordsString = fs.readFileSync(path.join(__dirname, "./badwords.txt"), "utf-8");
const badwords = badwordsString.split(/\r\n/);
const length = badwords.length;

// Test a string. Returns true if the string contains a bad word
export function containsBadWords(message: string) {
	for (let i = 0; i < length; i++) {
		if(message.includes(badwords[i])) {
			return true;
		}
	}
	return false;
}
