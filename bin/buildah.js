const util = require("util");
const childProcess = require("child_process");

const execFile = util.promisify(childProcess.execFile)

async function from(image, buildah = "buildah") {
    console.log("Buildah:", "from", image);
    const container = await execFile(buildah, ["from", image])
        .then(({stdout}) => stdout.trim());
    console.log("  ->", container);

    const _cmd = async (cmd, args) => {
        const processedArgs = processArguments(args);
        console.log(`Buildah [${container}]:`, cmd, ...processedArgs);
        return execFile(buildah, [cmd, container, ...processedArgs]);
    }

    const _config = async function (flag, args) {
        const processedArgs = processArguments(args);
        console.log(`Buildah [${container}]: config`, flag, ...processedArgs);
        return execFile(buildah, ["config", flag, ...processedArgs, container]);
    }

    return {
        add: async function () { return _cmd("add", arguments); },
        bud: async function () { return _cmd("bud", arguments); },
        commit: async function () { return _cmd("commit", arguments); },
        containers: async function () { return _cmd("containers", arguments); },
        copy: async function () { return _cmd("copy", arguments); },
        help: async function () { return _cmd("help", arguments); },
        images: async function () { return _cmd("images", arguments); },
        info: async function () { return _cmd("info", arguments); },
        inspect: async function () { return _cmd("inspect", arguments); },
        login: async function () { return _cmd("login", arguments); },
        logout: async function () { return _cmd("logout", arguments); },
        manifest: async function () { return _cmd("manifest", arguments); },
        mount: async function () { return _cmd("mount", arguments); },
        pull: async function () { return _cmd("pull", arguments); },
        push: async function () { return _cmd("push", arguments); },
        rename: async function () { return _cmd("rename", arguments); },
        rm: async function () { return _cmd("rm", arguments); },
        rmi: async function () { return _cmd("rmi", arguments); },
        run: async function () { return _cmd("run", arguments); },
        tag: async function () { return _cmd("tag", arguments); },
        umount: async function () { return _cmd("umount", arguments); },
        unshare: async function () { return _cmd("unshare", arguments); },
        version: async function () { return _cmd("version", arguments); },
        config: {
            annotation: async function () { return _config("--annotation", arguments); },
            arch: async function () { return _config("--arch", arguments); },
            author: async function () { return _config("--author", arguments); },
            cmd: async function () { return _config("--cmd", arguments); },
            comment: async function () { return _config("--comment", arguments); },
            createdBy: async function () { return _config("--created-by", arguments); },
            domainname: async function () { return _config("--domainname", arguments); },
            entrypoint: async function () { return _config("--entrypoint", arguments); },
            env: async function () { return _config("--env", arguments); },
            healthcheck: async function () { return _config("--healthcheck", arguments); },
            healthcheckInterval: async function () { return _config("--healthcheck-interval", arguments); },
            healthcheckRetries: async function () { return _config("--healthcheck-retries", arguments); },
            healthcheckStartPeriod: async function () { return _config("--healthcheck-start-period", arguments); },
            healthcheckTimeout: async function () { return _config("--healthcheck-timeout", arguments); },
            historyComment: async function () { return _config("--history-comment", arguments); },
            hostname: async function () { return _config("--hostname", arguments); },
            label: async function () { return _config("--label", arguments); },
            onbuild: async function () { return _config("--onbuild", arguments); },
            os: async function () { return _config("--os", arguments); },
            port: async function () { return _config("--port", arguments); },
            shell: async function () { return _config("--shell", arguments); },
            stopSignal: async function () { return _config("--stop-signal", arguments); },
            user: async function () { return _config("--user", arguments); },
            volume: async function () { return _config("--volume", arguments); },
            workingdir: async function () { return _config("--workingdir", arguments); },
        }
    }
}

function processArguments(args) {
    const processed = [];
    for (const argument of args) {
        if (Array.isArray(argument)) {
            processed.push(JSON.stringify(argument));
        } else if (argument.toString) {
            if (argument.toString() === "[object Object]") {
                processed.push(JSON.stringify(argument));
            } else {
                processed.push(argument.toString());
            }
        } else {
            processed.push(argument);
        }
    }
    return processed;
}

exports.from = from;
