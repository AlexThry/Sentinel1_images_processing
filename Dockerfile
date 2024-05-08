FROM ubuntu:18.04

# SNAP is still stuck with Python 3.6, i.e. ubuntu:18.04
# https://forum.step.esa.int/t/modulenotfounderror-no-module-named-jpyutil/25785/2

LABEL authors="Carmen Tawalika,Markus Neteler"
LABEL maintainer="tawalika@mundialis.de,neteler@mundialis.de"

ENV DEBIAN_FRONTEND noninteractive

USER root

# Install dependencies and tools
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends --no-install-suggests \
    sudo \
    build-essential \
    curl \
    checkinstall \
    libgfortran5 \
    locales \
    python3 \
    python3-dev \
    python3-pip \
    python3-setuptools \
    git \
    vim \
    wget \
    zip \
    libreadline-gplv2-dev libncursesw5-dev libssl-dev \
    libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev libffi-dev zlib1g-dev \
    && apt-get autoremove -y \
    && apt-get clean -y

# Set the locale
ENV LANG en_US.utf8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.utf8

# SNAP wants the current folder '.' included in LD_LIBRARY_PATH
ENV LD_LIBRARY_PATH ".:$LD_LIBRARY_PATH"

# install SNAPPY
RUN apt-get install default-jdk maven -y
ENV JAVA_HOME "/usr/lib/jvm/java-11-openjdk-amd64/"
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3 1
COPY snap /src/snap
RUN bash /src/snap/install.sh
RUN update-alternatives --remove python /usr/bin/python3

# due to Ubuntu-GDAL being too old we prefer to use the SNAP-bundled GDAL:
# INFO: org.esa.s2tbx.dataio.gdal.GDALVersion: GDAL not found on system. Internal GDAL 3.0.0 from distribution will be used. (f1)

# path
RUN echo "export PATH=\$PATH:/usr/local/snap/bin/:/root/.snap/auxdata/gdal/gdal-3-2-1/bin" >> /root/.bashrc

# tests
# https://senbox.atlassian.net/wiki/spaces/SNAP/pages/50855941/Configure+Python+to+use+the+SNAP-Python+snappy+interface
RUN (cd /root/.snap/snap-python/snappy && python3 setup.py install)
RUN /usr/bin/python3 -c 'from snappy import ProductIO'
RUN /usr/bin/python3 /src/snap/about.py
RUN /root/.snap/auxdata/gdal/gdal-3-2-1/bin/gdal-config --version

# Install nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# Install Node.js
RUN /bin/bash -c "source $HOME/.nvm/nvm.sh && nvm install v16.20.2"

# Add Node.js to path
ENV PATH /root/.nvm/versions/node/v16.20.2/bin:$PATH

# Install the backend
COPY backend /src/backend
RUN bash /src/backend/install_backend.sh


# Expose port 8080
EXPOSE 8080

# Reduce the image size
RUN apt-get autoremove -y
RUN apt-get clean -y
RUN rm -rf /src

#install supervisor

WORKDIR /Sentinel1_images_processing/app/express-app

#install supervisor and add to path 
RUN npm install supervisor -g
ENV PATH /usr/local/share/npm/bin:$PATH


CMD ["supervisor", "app.js"]