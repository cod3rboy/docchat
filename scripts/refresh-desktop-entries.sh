#!/bin/sh
set -e

# Update the global desktop file database
if [ -x "$(command -v update-desktop-database)" ]; then
    update-desktop-database -q /usr/share/applications
fi

# Force refresh the hicolor icon cache (where nfpm usually installs icons)
if [ -x "$(command -v gtk-update-icon-cache)" ]; then
    gtk-update-icon-cache -f -t /usr/share/icons/hicolor
fi
