type Severity = "debug" | "info" | "warning" | "error";

export type ConsoleMessage = {
  timestamp: Date;
  severity: Severity;
  message: string;
};

export const consoleMessages: ConsoleMessage[] = [];

function argToString(arg: unknown): string {
  if (typeof arg === "string") {
    return arg;
  }

  if (arg === null) {
    return "<null>";
  }

  if (arg === undefined) {
    return "<undefined>";
  }

  if (Array.isArray(arg) || typeof arg === "object") {
    return JSON.stringify(arg);
  }

  return arg.toString();
}

export function addConsoleMessage(severity: Severity, args: unknown[]) {
  const message = args.map(argToString).join(" ");
  consoleMessages.push({
    timestamp: new Date(),
    severity,
    message,
  });
}

export function clearConsoleMessages() {
  consoleMessages.splice(0, consoleMessages.length);
}

const originalFns: Partial<Record<FnName, Fn>> = {};

const fnNames: FnName[] = ["debug", "log", "info", "warn", "error"];

type FnName = keyof typeof console;
type Fn = typeof console.info;

function wrap(fnName: FnName, severity: Severity) {
  if (fnName in originalFns) {
    // is already wrapped
  } else {
    const original = console[fnName];
    const wrapped: Fn = (...args: unknown[]) => {
      addConsoleMessage(severity, args);
      // @ts-expect-error this mismatch
      original.apply(console, args);
    };
    console[fnName] = wrapped;
  }
}

function unwrap(fnName: FnName) {
  const originalFn = originalFns[fnName];
  if (originalFn) {
    console[fnName] = originalFn;
    delete originalFns[fnName];
  }
}

export function grabConsoleMessages() {
  wrap("debug", "debug");
  wrap("log", "info");
  wrap("info", "info");
  wrap("warn", "warning");
  wrap("error", "error");
}

export function ungrabConsoleMessages() {
  fnNames.forEach(unwrap);
}
