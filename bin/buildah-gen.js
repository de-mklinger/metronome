#!/usr/bin/env node

const util = require("util");
const childProcess = require("child_process");
// const camelCase = require("camelcase")

const execFile = util.promisify(childProcess.execFile)

async function getCommands(buildah) {
    const commands = [];
    const {stdout} = await execFile(buildah, ["--help"], {env: {LANG: "C"}});
    const lines = stdout.split("\n");
    let inCommands = false;
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === "Available Commands:") {
            inCommands = true;
        } else if (inCommands) {
            if (trimmedLine === "") {
                inCommands = false;
            } else {
                const [command] = trimmedLine.split(/\s+/);
                commands.push(command);
            }
        }
    }

    if (commands.length < 25) {
        throw new Error("Expected at east 25 commands, but have " + commands.length);
    }

    return commands;
}

async function getConfigFlags(buildah) {
    const configFlags = [];
    const {stdout} = await execFile(buildah, ["config", "--help"], {env: {LANG: "C"}});
    const lines = stdout.split("\n");
    let inConfigFlags = false;
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === "Flags:") {
            inConfigFlags = true;
        } else if (inConfigFlags) {
            if (trimmedLine === "") {
                inConfigFlags = false;
            } else {
                const [shortFlag, longFlag] = trimmedLine.split(/\s+/);
                if (shortFlag.startsWith("--")) {
                    configFlags.push(shortFlag);
                } else if (longFlag.startsWith("--")) {
                    configFlags.push(longFlag);
                } else {
                    throw new Error(`Invalid flag line: '${trimmedLine}'`);
                }
            }
        }
    }

    if (configFlags.length < 25) {
        throw new Error(`Expected at east 25 config flags, but have ${configFlags.length}`);
    }

    return configFlags;
}

const camelCase = (input) => {
    return input.replace(/[_.\- ]+([\p{Alpha}\p{N}_]|$)/gu, (_, p1) => p1.toUpperCase())
        .replace(/\d+([\p{Alpha}\p{N}_]|$)/gu, m => m.toUpperCase());
};

async function gen(image, buildah = "buildah") {
    // console.log("Get commands...");
    const commands = await getCommands(buildah);
    // console.log("Get commands done.", commands);

    // console.log("Get config flags...");
    const configFlags = await getConfigFlags(buildah);
    // console.log("Get config flags done.", configFlags);

    console.log("const buildah = {");
    for (const command of commands) {
        if (command !== "from" && command !== "config") {
            console.log(`    ${command}: async function () { return _cmd("${command}", arguments); },`)
        }
    }

    console.log("    config: {");
    for (const configFlag of configFlags) {
        if (configFlag !== "--add-history" && configFlag !== "--help") {
            const functionName = camelCase(configFlag.substr(2));
            console.log(`        ${functionName}: async function () { return _config("${configFlag}", arguments); },`);
        }
    }
    console.log("    }")
    console.log("}")
}


gen()