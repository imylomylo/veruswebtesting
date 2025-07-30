#!/bin/bash
# bridge.vdex
verus -chain=vdex getcurrency i6j1rzjgrDhSmUYiTtp21J8Msiudv5hgt9 > i6j1rzjgrDhSmUYiTtp21J8Msiudv5hgt9.json

# bridge.chips
verus -chain=chips getcurrency i3nokiCTVevZMLpR3VmZ7YDfCqA5juUqqH > i3nokiCTVevZMLpR3VmZ7YDfCqA5juUqqH.json
# highroller.chips
verus -chain=chips getcurrency iNLBYPcNM3c5mzRdtfjd9Hk86WPijQfZhW > iNLBYPcNM3c5mzRdtfjd9Hk86WPijQfZhW.json
# bankroll.chips
verus -chain=chips getcurrency iDetLA1snrDVhCCk42rdWfqmJcYCMcEFry > iDetLA1snrDVhCCk42rdWfqmJcYCMcEFry.json

rsync -avz i6j1rzjgrDhSmUYiTtp21J8Msiudv5hgt9.json user@host:/opt/easyengine/sites/raw.verus.trading/app/htdocs/files/
rsync -avz i3nokiCTVevZMLpR3VmZ7YDfCqA5juUqqH.json user@host:/opt/easyengine/sites/raw.verus.trading/app/htdocs/files/
rsync -avz iNLBYPcNM3c5mzRdtfjd9Hk86WPijQfZhW.json user@host:/opt/easyengine/sites/raw.verus.trading/app/htdocs/files/
rsync -avz iDetLA1snrDVhCCk42rdWfqmJcYCMcEFry.json user@host:/opt/easyengine/sites/raw.verus.trading/app/htdocs/files/

# STAKING INFO 
verus -chain=vdex getmininginfo > vdex.mininginfo.json
verus -chain=chips getmininginfo > chips.mininginfo.json

rsync -avz vdex.mininginfo.json user@host:/opt/easyengine/sites/raw.verus.trading/app/htdocs/files/
rsync -avz chips.mininginfo.json user@host:/opt/easyengine/sites/raw.verus.trading/app/htdocs/files/

# in crontab
# * * * * * /path/to/rvt-data/get_data.sh > /dev/null 2>&1