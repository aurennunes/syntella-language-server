# syntella-language-server

An editor-agnostic launcher for the [Syntella](https://syntella.dev) language
server.

The language server itself ships **inside the `syt` binary** as `syt lsp`: a
JSON-RPC server that speaks LSP over stdio. This package is a thin wrapper that
resolves `syt` and execs `syt lsp`, so any editor or tool that expects an
installable `*-language-server` executable can start it with one command.

## Capabilities

Served by `syt lsp` (negotiated at `initialize`, `positionEncoding: utf-8`):

- **Diagnostics** on change: lexing, name resolution (sema), and type checking.
- **Hover.**
- **Go to definition.**
- **Document symbols** (outline, breadcrumbs).
- **Completion**, triggered on `.` — keywords, builtins, types, `use`-able
  modules (stdlib and native: `net`/`ws`/`crypto`/`ui`/...), and module members
  (including the `ui` desktop-GUI methods).
- **Document formatting** (`syt fmt`).

## Install

Requires the `syt` binary on your `PATH`:

```sh
curl -fsSL dl.syntella.dev/install.sh | bash
```

Then, optionally, install this launcher:

```sh
npm install -g syntella-language-server
```

If `syt` is not on your `PATH`, point the launcher at it:

```sh
export SYNTELLA_SYT=/absolute/path/to/syt
```

You can always skip this package and run `syt lsp` directly, wherever a command
is expected.

## Editor setup

### VS Code

Use the [Syntella extension](https://github.com/aurennunes/syntella-vscode); it
starts the server for you.

### Neovim (nvim-lspconfig)

```lua
vim.filetype.add({ extension = { syt = "syntella" } })

local configs = require("lspconfig.configs")
local lspconfig = require("lspconfig")

if not configs.syntella then
  configs.syntella = {
    default_config = {
      cmd = { "syt", "lsp" },        -- or { "syntella-language-server" }
      filetypes = { "syntella" },
      root_dir = lspconfig.util.root_pattern("syt.toml", ".git"),
      single_file_support = true,
    },
  }
end

lspconfig.syntella.setup({})
```

### Helix (`languages.toml`)

```toml
[language-server.syntella]
command = "syt"
args = ["lsp"]

[[language]]
name = "syntella"
scope = "source.syntella"
file-types = ["syt"]
roots = ["syt.toml"]
language-servers = ["syntella"]
comment-token = "//"
indent = { tab-width = 4, unit = "    " }
```

### Zed

```json
{
  "lsp": {
    "syntella": {
      "binary": { "path": "syt", "arguments": ["lsp"] }
    }
  }
}
```

### Emacs (eglot)

```elisp
(add-to-list 'auto-mode-alist '("\\.syt\\'" . prog-mode))
(with-eval-after-load 'eglot
  (add-to-list 'eglot-server-programs
               '(prog-mode . ("syt" "lsp"))))
```

### Sublime Text (LSP package)

```json
{
  "clients": {
    "syntella": {
      "enabled": true,
      "command": ["syt", "lsp"],
      "selector": "source.syntella"
    }
  }
}
```

## License

MIT. Part of the [Syntella](https://github.com/aurennunes/syntella) project.
