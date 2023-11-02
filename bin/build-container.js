#!/usr/bin/env node

const fsPromises = require("fs/promises")

async function build() {

    const packageInfo = await fsPromises.readFile("package.json", {encoding: "utf-8"})
        .then(JSON.parse);

    const buildah = await require("./buildah.js").from("nginx:stable-alpine");
    try {
        await buildah.copy("build", "/usr/share/nginx/html");
        await buildah.config.port(80);
        await buildah.config.cmd(["nginx", "-g", "daemon off;"]);
        await buildah.commit(`mklinger.de/mklinger/${packageInfo.name}:${packageInfo.version}`);
    } finally {
        await buildah.rm();
    }
}

build().then(() => console.log("Done"));
