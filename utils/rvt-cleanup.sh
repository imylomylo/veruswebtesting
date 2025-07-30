#!/bin/bash

# Directory to check
DIR="/path/to/htdocs/files/"

# Delete *.json files older than 15 minutes
find "$DIR" -type f -name "*.json" -mmin +15 -exec rm -f {} \;


# in crontab
# */15 * * * * /path/to/rvt-cleanup.sh > /dev/null 2>&1