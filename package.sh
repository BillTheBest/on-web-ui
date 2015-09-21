#!/bin/bash

# debian packages expected...
# apt-get install git pbuilder dh-make ubuntu-dev-tools devscripts

# git clone . packagebuild
# pushd packagebuild

git log -n 1 --pretty=format:%h.%ai.%s > on-web-ui_commitstring.txt

GITCOMMITDATE=$(git show -s --pretty="format:%ci")
DATESTRING=$(date -d "$GITCOMMITDATE" -u +"%Y-%m-%d-%H%M%SZ")

PKG_VERSION="$DATESTRING"
if [ -n "$BUILD_NUMBER" ]
then
  PKG_VERSION="${PKG_VERSION}-${BUILD_NUMBER}"
fi

export DEBEMAIL="hwimo robots <hwimo@hwimo.lab.emc.com>"
export DEBFULLNAME="The HWIMO Robots"

dch -v ${PKG_VERSION} autobuild
debuild --no-lintian --no-tgz-check -us -uc

# popd
