FROM debian:stable-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y -q --no-install-recommends \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    build-essential \
    g++ \
    apt-transport-https \
    ca-certificates \
    curl \
    git \
    libssl-dev \
    wget

ENV NVM_DIR /usr/local/nvm
RUN mkdir -p $NVM_DIR
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
ENV NODE_VERSION v20.10.0
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION"

ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH

COPY package.json yarn.lock /app/
RUN npm install -g yarn
RUN yarn install --frozen-lockfile
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN node-prune
COPY . /app/
RUN yarn build

FROM debian:stable-slim AS runtime
WORKDIR /app
COPY --from=builder /app /app
COPY --from=builder /usr/local/nvm/versions/node/v20.10.0/bin/node /bin/node

CMD ["node", "./dist"]