
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

const slashes = ['/*', '*/', '/*', '*/', '/*', '*/'];
const hashes = ['#', '#', '#', '#', '#', '#'];
const semicolons = [';; ', ' ;;', ';;', ';;', ';; ', ' ;;']
const parens = ['(* ', ' *)', '(*', '*)', '(* ', ' *)']
const dashes = ['-- ', ' --', '--', '--', '-- ', ' --']
const percents = ['%% ', ' %%', '%%', '%%', '%% ', ' %%']
const angleBrackets = ['<!-- ', '*', '*', '*', '*', ' -->']
const blockCommentDelimiters = ['<# ', ' #>', '<#', '#>', '<# ', ' #>']

export const languageDelimiters: { [lang: string]: string[] | undefined } = {
  'asm': semicolons,
  'c': slashes,
  'coffeescript': hashes,
  'cpp': slashes,
  'css': slashes,
  'dockerfile': hashes,
  'dart': slashes,
  'fsharp': parens,
  'go': slashes,
  'groovy': slashes,
  'haskell': dashes,
  'html': angleBrackets,
  'ini': semicolons,
  'jade': slashes,
  'java': slashes,
  'javascript': slashes,
  'javascriptreact': slashes,
  'kotlin': slashes,
  'latex': percents,
  'less': slashes,
  'lua': dashes,
  'makefile': hashes,
  'objective-c': slashes,
  'ocaml': parens,
  'perl': hashes,
  'perl6': hashes,
  'php': slashes,
  'plaintext': hashes,
  'powershell': hashes,
  'python': hashes,
  'r': hashes,
  'ruby': hashes,
  'rust': slashes,
  'scss': slashes,
  'shellscript': hashes,
  'solidity': slashes,
  'sql': hashes,
  'swift': slashes,
  'typescript': slashes,
  'typescriptreact': slashes,
  'verse': blockCommentDelimiters,
  'vue': angleBrackets,
  'xsl': slashes,
  'yaml': hashes,
};
