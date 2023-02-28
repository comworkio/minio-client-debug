#!/bin/bash

REPO_PATH="${PROJECT_HOME}/minio-client-debug/"

cd "${REPO_PATH}" && git pull origin main || :
git push github main
git push gitlab main
exit 0
