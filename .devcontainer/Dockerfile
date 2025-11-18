FROM mcr.microsoft.com/devcontainers/base:jammy

# Install CA tooling + Ruby toolchain + common build deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      ruby-full ruby-dev \
      build-essential \
      zlib1g-dev libffi-dev libyaml-dev \
      git curl tzdata \
      imagemagick \
      # Certs:
      ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Certs: Copy your corporate root CA(s) into the trusted location
# (Only .crt files are processed by update-ca-certificates)
COPY certs/*.crt /usr/local/share/ca-certificates/

# Certs: Register the new CA with the system trust store
RUN update-ca-certificates

# Certs: Make uv honor the OS trust store (and set common CA envs for other tools)
ENV UV_NATIVE_TLS=true \
    SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt \
    REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt \
    CURL_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt \
    NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

# Install jekyll/bundler system-wide (puts bins on PATH for all users)
# Also avoid gem docs to speed up builds
RUN gem install --no-document bundler jekyll

# --- Use a GEM_HOME that exists in the image and is writable by the dev user ---
# Choose a conventional, version-agnostic path for gems
ENV GEM_HOME=/usr/local/bundle
ENV PATH=$GEM_HOME/bin:$PATH
ENV BUNDLE_PATH=$GEM_HOME
ENV BUNDLE_BIN=$GEM_HOME/bin
ENV BUNDLE_SILENCE_ROOT_WARNING=1
# (Optional) speed up bundler in CI/containers
ENV BUNDLE_JOBS=4 BUNDLE_RETRY=3

# Create and own the gem directory for the non-root devcontainers user
ARG USERNAME=vscode
RUN mkdir -p "${GEM_HOME}" && chown -R "${USERNAME}:${USERNAME}" "${GEM_HOME}" \
    && printf "gem: --no-document\n" > /etc/gemrc

# Preinstall common tools system-wide (bins will also live in $GEM_HOME/bin)
# Install gems as the dev user so files aren’t root-owned
USER ${USERNAME}
RUN gem install bundler jekyll
USER root

# Optional hardening (helps if you ever mount a volume over /usr/local/bundle):
RUN chmod -R u+rwX,g+rwX "${GEM_HOME}"

# Default workspace
WORKDIR /workspaces/site