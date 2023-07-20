#  Use https instead of ssh for git (currently required for jawid-h/protobuf.js.git)
git config --global url."https://github.com/".insteadOf ssh://git@github.com/

# Install dependencies
npm ci

# Output a mnemonic and it's first address to a file
npx mocha -g 'unused' | grep -iE 'mnemonic|address' >> wallet-info.txt
cat wallet-info.txt
