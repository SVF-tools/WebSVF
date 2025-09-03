# Build SVF from source
ARG TARGETPLATFORM=linux/amd64
FROM --platform=$TARGETPLATFORM ubuntu:22.04

# Stop ubuntu interactive options
ENV DEBIAN_FRONTEND=noninteractive

# Define home directory
ENV HOME=/home/SVF-tools

# Install dependencies for SVF and pysvf
RUN apt-get update --fix-missing && \
    apt-get install -y \
    g++ gcc git zlib1g-dev libncurses5-dev libtinfo6 \
    build-essential libssl-dev libpcre2-dev zip libzstd-dev \
    wget xz-utils tcl software-properties-common curl \
    python3.10 python3.10-dev python3-pip pybind11-dev ninja-build \
    patchelf clang llvm bsdutils && \
    update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.10 1 && \
    rm -rf /var/lib/apt/lists/*

# Install CMake 3.23+ (required for SVF-Python)
RUN wget https://github.com/Kitware/CMake/releases/download/v3.29.0/cmake-3.29.0-linux-x86_64.sh && \
    chmod +x cmake-3.29.0-linux-x86_64.sh && \
    ./cmake-3.29.0-linux-x86_64.sh --skip-license --prefix=/usr/local && \
    rm cmake-3.29.0-linux-x86_64.sh && \
    ln -sf /usr/local/bin/cmake /usr/bin/cmake

# Clone and build SVF-Python for pysvf
WORKDIR ${HOME}
RUN git clone "https://github.com/SVF-tools/SVF-Python.git"
WORKDIR ${HOME}/SVF-Python
RUN echo "Building SVF-Python..." && \
    export TAR_OPTIONS="--no-same-owner" && \
    bash ./build.sh && \
    python3 -m pip install dist/*.whl

# Set up working directory for the Python app
WORKDIR /app

# Copy Python API files
COPY ./app.py ./
COPY ./requirements.txt ./

# Install Python dependencies
RUN python3 -m pip install --upgrade pip && \
    python3 -m pip install -r requirements.txt

# Expose port
EXPOSE 8080

# Command to run the API
CMD ["python3", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
