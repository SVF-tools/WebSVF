#!/bin/bash
# System: Ubuntu 18.04 / 20.04
# type: 'source setup.sh' for install llvm wllvm svf

########
# 1. test
########
# 1.1 delete residual files
rm example.c result.bc
# 2.2 create test example.c
echo "#include<stdio.h>
int main()
{
	int a=3;
	int b=4;
	int c=0;
    c = a*b;
    return c;
}" >> example.c # write c program into example.c
# 2.3 test llvm through clang
clang -c -emit-llvm -g ./example.c -o ./result.bc # generate result.bc
# 2.4 test svf through wpa
wpa -ander ./result.bc # analysis result.bc
# 2.5 delete residual files
rm example.c result.bc