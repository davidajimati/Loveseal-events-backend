#!/bin/bash

# Make sure you are in the repo root
if [ ! -f ".gitignore" ]; then
  echo ".gitignore not found in this directory!"
  exit 1
fi

# Remove all tracked files that are in .gitignore
git rm -r --cached $(git ls-files -i -c --exclude-standard)

echo "All ignored files have been removed from git index but kept locally."
