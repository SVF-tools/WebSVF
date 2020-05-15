#!/bin/bash

filename=$1
if [ "$filename" = "" ]; then
	filename=example.c
fi

clang -c -emit-llvm -g ./$filename -o ./result.bc

wpa -ander ./result.bc