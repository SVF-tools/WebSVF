"""
Module support for the wllvm-sanity-checker tool.

The wllvm-sanity-checker tool examines the users
environment to see if it makes sense from the
wllvm point of view. Useful first step in trying to
debug a failure.
"""
from __future__ import print_function

import sys
import os
import subprocess as sp
import errno

from .version import wllvm_version, wllvm_date
from .logconfig import loggingConfiguration

explain_LLVM_COMPILER = """

The environment variable 'LLVM_COMPILER' is a switch. It should either
be set to 'clang' or 'dragonegg'. Anything else will cause an error.

"""

explain_LLVM_DRAGONEGG_PLUGIN = """

You need to set the environment variable LLVM_DRAGONEGG_PLUGIN to the
full path to your dragonegg plugin. Thanks.

"""

explain_LLVM_CC_NAME = """

If your clang compiler is not called clang, but something else, then
you will need to set the environment variable LLVM_CC_NAME to the
appropriate string. For example if your clang is called clang-3.5 then
LLVM_CC_NAME should be set to clang-3.5.

"""

explain_LLVM_CXX_NAME = """

If your clang++ compiler is not called clang++, but something else,
then you will need to set the environment variable LLVM_CXX_NAME to
the appropriate string. For example if your clang++ is called ++clang
then LLVM_CC_NAME should be set to ++clang.

"""

explain_LLVM_COMPILER_PATH = """

Your compiler should either be in your PATH, or else located where the
environment variable LLVM_COMPILER_PATH indicates. It can also be used
to indicate the directory that contains the other LLVM tools such as
llvm-link, and llvm-ar.

"""

explain_LLVM_LINK_NAME = """

If your llvm linker is not called llvm-link, but something else, then
you will need to set the environment variable LLVM_LINK_NAME to the
appropriate string. For example if your llvm-link is called llvm-link-3.5 then
LLVM_LINK_NAME should be set to llvm-link-3.5.

"""

explain_LLVM_AR_NAME = """

If your llvm archiver is not called llvm-ar, but something else,
then you will need to set the environment variable LLVM_AR_NAME to
the appropriate string. For example if your llvm-ar is called llvm-ar-3.5
then LLVM_AR_NAME should be set to llvm-ar-3.5.

"""

class Checker(object):
    def __init__(self):
        path = os.getenv('LLVM_COMPILER_PATH')

        if path and path[-1] != os.path.sep:
            path = path + os.path.sep

        self.path = path if path else ''

    def check(self):
        """Performs the environmental sanity check.

        Performs the following checks in order:
        0. Prints out the logging configuartion
        1. Check that the OS is supported.
        2. Checks that the compiler settings make sense.
        3. Checks that the needed LLVM utilities exists.
        4. Check that the store, if set, exists.
        """

        self.checkSelf()

        self.checkLogging()

        if not self.checkOS():
            print('I do not think we support your OS. Sorry.')
            return 1

        success = self.checkCompiler()

        if success:
            self.checkAuxiliaries()
            self.checkStore()

        return 0 if success else 1

    def checkSelf(self):
        print('wllvm version: {0}'.format(wllvm_version))
        print('wllvm released: {0}\n'.format(wllvm_date))


    def checkLogging(self):
        (destination, level) = loggingConfiguration()
        print('Logging output to {0}.'.format(destination if destination else 'standard error'))
        if not level:
            print('Logging level not set, defaulting to WARNING\n')
        else:
            print('Logging level set to {0}.\n'.format(level))


    def checkOS(self):
        """Returns True if we support the OS."""
        return (sys.platform.startswith('freebsd') or
                sys.platform.startswith('linux') or
                sys.platform.startswith('darwin'))


    def checkSwitch(self):
        """Checks the correctness of the LLVM_COMPILER env var."""
        compiler_type = os.getenv('LLVM_COMPILER')
        if compiler_type == 'clang':
            return (1, '\nWe are using clang.\n')
        elif compiler_type == 'dragonegg':
            return (2, '\nWe are using dragonegg.\n')
        return (0, explain_LLVM_COMPILER)


    def checkClang(self):
        """Checks for clang and clang++."""
        cc_name = os.getenv('LLVM_CC_NAME')
        cxx_name = os.getenv('LLVM_CXX_NAME')

        cc = '{0}{1}'.format(self.path, cc_name if cc_name else 'clang')
        cxx = '{0}{1}'.format(self.path, cxx_name if cxx_name else 'clang++')

        return self.checkCompilers(cc, cxx)


    def checkDragonegg(self):
        """Checks for gcc, g++ and the dragonegg plugin."""
        if not self.checkDragoneggPlugin():
            return False

        pfx = ''
        if os.getenv('LLVM_GCC_PREFIX') is not None:
            pfx = os.getenv('LLVM_GCC_PREFIX')

        cc = '{0}{1}gcc'.format(self.path, pfx)
        cxx = '{0}{1}g++'.format(self.path, pfx)

        return self.checkCompilers(cc, cxx)


    def checkDragoneggPlugin(self):
        """Checks for the dragonegg plugin."""
        plugin = os.getenv('LLVM_DRAGONEGG_PLUGIN')

        if not plugin:
            print(explain_LLVM_DRAGONEGG_PLUGIN)
            return False

        if os.path.isfile(plugin):
            try:
                open(plugin)
            except IOError as e:
                print("Unable to open {0}: {1}".format(plugin, str(e)))
            else:
                return True
        else:
            print("Could not find {0}".format(plugin))
            return False


    def checkCompiler(self):
        """Determines the chosen compiler, and checks it."""
        (code, comment) = self.checkSwitch()

        if code == 0:
            print(comment)
            return False
        elif code == 1:
            print(comment)
            return self.checkClang()
        elif code == 2:
            print(comment)
            return self.checkDragonegg()
        print('Insane')
        return False



    def checkCompilers(self, cc, cxx):
        """Tests that the compilers actually exist."""
        (ccOk, ccVersion) = self.checkExecutable(cc)
        (cxxOk, cxxVersion) = self.checkExecutable(cxx)

        if not ccOk:
            print('The C compiler {0} was not found or not executable.\nBetter not try using wllvm!\n'.format(cc))
        else:
            print('The C compiler {0} is:\n\n\t{1}\n'.format(cc, extractLine(ccVersion, 0)))

        if not cxxOk:
            print('The CXX compiler {0} was not found or not executable.\nBetter not try using wllvm++!\n'.format(cxx))
        else:
            print('The C++ compiler {0} is:\n\n\t{1}\n'.format(cxx, extractLine(cxxVersion, 0)))

        if not ccOk or  not cxxOk:
            print(explain_LLVM_COMPILER_PATH)
            if not ccOk:
                print(explain_LLVM_CC_NAME)
            if not cxxOk:
                print(explain_LLVM_CXX_NAME)



        return ccOk or cxxOk


    def checkExecutable(self, exe, version_switch='-v'):
        """Checks that an executable exists, and is executable."""
        cmd = [exe, version_switch]
        try:
            compiler = sp.Popen(cmd, stdout=sp.PIPE, stderr=sp.PIPE)
            output = compiler.communicate()
            compilerOutput = '{0}{1}'.format(output[0], output[1])
        except OSError as e:
            if e.errno == errno.EPERM:
                return (False, '{0} not executable'.format(exe))
            elif e.errno == errno.ENOENT:
                return (False, '{0} not found'.format(exe))
            return (False, '{0} not sure why, errno is {1}'.format(exe, e.errno))
        else:
            return (True, compilerOutput)



    def checkAuxiliaries(self):
        """Checks for the archiver and linker."""
        link_name = os.getenv('LLVM_LINK_NAME')
        ar_name = os.getenv('LLVM_AR_NAME')

        if not link_name:
            link_name = 'llvm-link'

        if not ar_name:
            ar_name = 'llvm-ar'

        link = '{0}{1}'.format(self.path, link_name) if self.path else link_name
        ar = '{0}{1}'.format(self.path, ar_name) if self.path else ar_name

        (linkOk, linkVersion) = self.checkExecutable(link, '-version')

        (arOk, arVersion) = self.checkExecutable(ar, '-version')

        if not linkOk:
            print('The bitcode linker {0} was not found or not executable.\nBetter not try using extract-bc!\n'.format(link))
            print(explain_LLVM_LINK_NAME)
        else:
            print('The bitcode linker {0} is:\n\n\t{1}\n'.format(link, extractLine(linkVersion, 1)))

        if not arOk:
            print('The bitcode archiver {0} was not found or not executable.\nBetter not try using extract-bc!\n'.format(ar))
            print(explain_LLVM_AR_NAME)
        else:
            print('The bitcode archiver {0} is:\n\n\t{1}\n'.format(ar, extractLine(arVersion, 1)))


    def checkStore(self):
        """Checks that the bitcode store, if set, makes sense."""
        store_dir = os.getenv('WLLVM_BC_STORE')
        if store_dir:
            if os.path.exists(store_dir) and os.path.isdir(store_dir) and os.path.isabs(store_dir):
                print('Using the bitcode store:\n\n\t{0}\n\n'.format(store_dir))
            else:
                print('The bitcode store:\n\n\t{0}\n\nis either not absolute, does not exist, or is not a directory.\n\n'.format(store_dir))
        else:
            print('Not using a bitcode store.\n\n')


def extractLine(version, n):
    if not version:
        return version
    lines = version.split('\n')
    line = lines[n] if n < len(lines) else lines[-1]
    return line.strip() if line else line
