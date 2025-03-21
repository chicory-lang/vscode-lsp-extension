# Chicory Language Server Extension for VS Code

Note: This whole project is a WIP. Expect bugs at every point, from syntax highlighting to LSP diagnostics.

## Development

1. You will need to compile the client and server. The root package.json includes a `watch` and a `compile` script that will accomplish this. Note that `tsconfig.tsbuildinfo` files are created in both the client and server directories. These files are used by the TypeScript compiler to speed up compilation. You will need to delete them if you want to start fresh.

2. With vscode open in the root of this project, you can use "Launch Client" to open the `[Extension Development Host]` VS Code window.

3. Opening or editing a file in that window should now support `.chic` files.

[Debugging instructions can be found here][debug]

## Usage with Neovim

You can use just the server with Neovim. I'm using bun here, because it will automatically handle dependencies etc. But you build and run the `server.ts` with typescript and node. If you can do that, somewhere in your neovim config, you'll need to add the following (if you're compiling the ts into js, make sure you point at the compiled file):

```lua
-- Define the custom server configuration for "chicory"
local lspconfig = require('lspconfig')
local configs = require('lspconfig.configs')

if not configs.chicory then
  configs.chicory = {
    default_config = {
      cmd = { 'bun', 'run', '/path/to/server.ts', '--stdio' },
      filetypes = { "chicory" },                                      -- Filetypes that trigger this server
      root_dir = lspconfig.util.root_pattern(".git", "package.json"), -- Determine project root by looking for a .git directory
    }
  }
end

lspconfig.chicory.setup {}
```

## Distributing your extension

Read the full [Publishing Extensions doc][publish] for the full details.

Note that you can package and distribute a standalone `.vsix` file without publishing it to the marketplace by following [these instructions][vsix].

## Anatomy

```
.
├── .vscode
│   ├── launch.json         // Tells VS Code how to launch our extension
│   └── tasks.json          // Tells VS Code how to build our extension
├── LICENSE
├── README.md
├── client
│   ├── package-lock.json   // Client dependencies lock file
│   ├── package.json        // Client manifest
│   ├── src
│   │   └── extension.ts    // Code to tell VS Code how to run our language server
│   └── tsconfig.json       // TypeScript config for the client
├── package-lock.json       // Top-level Dependencies lock file
├── package.json            // Top-level manifest
├── server
│   ├── package-lock.json   // Server dependencies lock file
│   ├── package.json        // Server manifest
│   ├── src
│   │   └── server.ts       // Language server code
│   └── tsconfig.json       // TypeScript config for the client
└── tsconfig.json           // Top-level TypeScript config
```

## Credits

This language server is based on this [minimal VS Code LSP implementation][minlsp].

[debug]: https://code.visualstudio.com/api/language-extensions/language-server-extension-guide#debugging-both-client-and-server
[publish]: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
[vsix]: https://code.visualstudio.com/api/working-with-extensions/publishing-extension#packaging-extensions
[minlsp]: https://github.com/semanticart/minimum-viable-vscode-language-server-extension