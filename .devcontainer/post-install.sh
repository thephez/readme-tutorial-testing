#  Use https instead of ssh for git (currently required for jawid-h/protobuf.js.git)
git config --global url."https://github.com/".insteadOf ssh://git@github.com/

# Install dependencies
npm ci