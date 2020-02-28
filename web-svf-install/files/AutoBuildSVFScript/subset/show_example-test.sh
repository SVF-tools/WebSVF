#!/bin/bash

filename=$1
if [ "$filename" = "" ]; then
	filename=example.c
fi

rm ./result/* -rf

clang -c -emit-llvm -g ./example/$filename -o ./result/result.bc

wpa -ander ./result/result.bc
