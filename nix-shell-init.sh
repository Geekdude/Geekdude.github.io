#!/usr/bin/env bash

nix-shell -p bundler -p bundix --run 'bundler update; bundler lock; bundler package --no-install --path vendor; BUNDLE_FORCE_RUBY_PLATFORM=true bundix; rm -rf vendor'

echo "You can now run nix-shell"
