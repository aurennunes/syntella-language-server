#!/usr/bin/env node
/*
 * syntella-language-server
 *
 * The Syntella language server is `syt lsp`: a JSON-RPC server over stdio that
 * ships inside the `syt` binary. This is a thin, editor-agnostic launcher so
 * that any editor or tool which expects an installable `*-language-server`
 * executable can start it. It resolves the `syt` binary and execs `syt lsp`,
 * forwarding stdio and the exit code.
 *
 * Resolution order for the `syt` binary:
 *   1. the SYNTELLA_SYT / SYT env var, if set;
 *   2. `syt` on PATH.
 * Any extra CLI args are passed through after `lsp`.
 */
import { spawn } from "node:child_process";

function resolveSyt(): string {
  return process.env.SYNTELLA_SYT || process.env.SYT || "syt";
}

function main(): void {
  const syt = resolveSyt();
  const passthrough = process.argv.slice(2);

  const child = spawn(syt, ["lsp", ...passthrough], {
    stdio: "inherit",
  });

  child.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "ENOENT") {
      process.stderr.write(
        `syntella-language-server: could not find the \`${syt}\` binary.\n` +
          `Install Syntella (https://syntella.dev) or set SYNTELLA_SYT to its path.\n`,
      );
    } else {
      process.stderr.write(`syntella-language-server: ${err.message}\n`);
    }
    process.exit(127);
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
}

main();
