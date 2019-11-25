#!/bin/bash

ETC_SYSCTL=/etc/sysctl.conf


if [ "$USER" = 'root' ]; then
    sed -i '/fs.inotify.max_user_watches=/ d' $ETC_SYSCTL

	echo 'fs.inotify.max_user_watches=524288' | tee -a $ETC_SYSCTL
else
	sudo sed -i '/fs.inotify.max_user_watches=/ d' $ETC_SYSCTL

	echo 'fs.inotify.max_user_watches=524288' | sudo tee -a $ETC_SYSCTL
fi

sudo sysctl -p