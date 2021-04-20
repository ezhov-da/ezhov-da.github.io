#!/usr/bin/env bash

# build new version
cd src
bundle exec jekyll build

# delete old files
cd ..
rm -rf "2020" "2021" "about" "assets"
rm -f *.html *.jpg *.ico *.xml

# copy new site
cp -rT src/_site ./

 create CHANGELOG.md
JAVA_EXE=/d/programs/zulu8.48.0.53-ca-jdk8.0.265-win_x64/bin/java.exe; \
VERSION=0.0.2; \
wget --no-check-certificate \
    -O "changelog-builder-console-application-${VERSION}.jar" \
    https://github.com/ezhov-da/changelog-builder/releases/download/v${VERSION}/changelog-builder-console-application-${VERSION}-fat.jar && \
    ${JAVA_EXE} -jar changelog-builder-console-application-${VERSION}.jar && \
    rm -f "changelog-builder-console-application-${VERSION}.jar"
