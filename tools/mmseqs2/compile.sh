#!/bin/bash

mkdir -p build-cmake && cd build-cmake
emcmake cmake ../src -DCMAKE_BUILD_TYPE=RelWithDebInfo -DREQUIRE_OPENMP=0 -DCMAKE_CXX_FLAGS="$EM_FLAGS"
emmake make -j
cp src/mmseqs.{js,wasm} ../build

