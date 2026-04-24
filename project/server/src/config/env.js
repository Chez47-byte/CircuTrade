import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootEnvPath = path.resolve(__dirname, "../../.env");
const serverEnvPath = path.resolve(__dirname, "../../../server/.env");

dotenv.config({
  path: fs.existsSync(rootEnvPath) ? rootEnvPath : serverEnvPath,
  override: true,
});
