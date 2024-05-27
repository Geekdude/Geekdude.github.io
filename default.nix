with (import <nixpkgs> { });

let env = bundlerEnv {
   name = "jekyll_env";
   inherit ruby;
   gemfile = ./Gemfile;
   lockfile = ./Gemfile.lock;
   gemset = ./gemset.nix;
   BUNDLE_FORCE_RUBY_PLATFORM = true;
};
in stdenv.mkDerivation {
   name = "geekdude.gs";
   buildInputs = [ env bundler ruby ];
}
