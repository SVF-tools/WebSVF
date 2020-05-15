#!/bin/bash
timeout=5
target=www.github.com
ret_code=`curl -I -s --connect-timeout $timeout $target -w %{http_code} | tail -n1`
if [ "x$ret_code" = "x301" ]; then
	return 0;
else
	return 231;
fi