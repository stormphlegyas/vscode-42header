<img
  src="https://raw.githubusercontent.com/stormphlegyas/vscode-42header/master/42.png" 
  width=128>

# 42 Header V2 for VSCode

This extension integrates the 42 header in VS Code to easily include it in your source code files.

```bash
# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    vscode-42headerV2                                  :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mmoumini <mmoumini@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2013/11/18 13:37:42 by mmoumini          #+#    #+#              #
#    Updated: 2016/09/18 13:11:04 by mmoumini         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #
```

## Install

You can install the extension by searching for "42headerV2" in the VS Code Extensions Marketplace or by launching Quick Open with <kbd>⌘</kbd>+<kbd>P</kbd> and entering the command:

```
ext install 42headerV2
```

## Usage

### Insert a header
 - **macOS** : <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>H</kbd>
 - **Linux** / **Windows** : <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>H</kbd>.

The header will be automatically updated on save.


## Configuration

By default, the extension will import your **username** and **email** from environment variables. However, you can override these values by specifying them in your *User Settings*:

```ts
{
  "42header.username": string,
  "42header.email": string
}
```

## Supported Languages

This extension supports a wide range of programming languages. For each language, it uses a specific delimiter to create the header. Here's a list of the supported languages:

- Assembly Language
- C
- C++
- CoffeeScript
- CSS
- Dockerfile
- F#
- Go
- Groovy
- Haskell
- HTML
- INI
- Jade
- Java
- JavaScript
- JavaScript React
- Kotlin
- LaTeX
- Less
- Lua
- Makefile
- Objective-C
- OCaml
- Perl
- Perl6
- PHP
- Plaintext
- PowerShell
- Python
- R
- Ruby
- Rust
- SASS
- SCSS
- ShellScript
- Solidity
- SQL
- Swift
- TypeScript
- TypeScript React
- Vue
- XSL
- YAML

## Issues

In case of a bug, or missing feature, please create a [Github Pull Request](https://github.com/stormphlegyas/vscode-42header/pulls).

## License

MIT
