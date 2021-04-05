# biowasm

![cdn-stg.biowasm.com](https://github.com/biowasm/biowasm/workflows/Deploy%20biowasm-stg/badge.svg) ![cdn.biowasm.com](https://github.com/biowasm/biowasm/workflows/Deploy%20biowasm-prd/badge.svg)

A repository of genomics tools, compiled from C/C++ to WebAssembly so they can run in a web browser:

* [samtools/htslib v1.10](tools/samtools)
* [bedtools v2.29](tools/bedtools2)
* [bowtie v2.4.2](tools/bowtie2)
* [fastp v0.20.1](tools/fastp)
* [seqtk v1.3](tools/seqtk)
* [ssw v1.2.4](tools/ssw)
* [wgsim](tools/wgsim)
* [bhtsne](tools/bhtsne)
* [seq-align](tools/seq-align)
* [MMseqs2](tools/mmseqs2)


## How it works

* **biowasm**: a collection of recipes for compiling C/C++ genomics tools to WebAssembly &mdash; this repo
* **biowasm CDN**: a server where we host the pre-compiled tools for use in your apps &mdash; [cdn.biowasm.com](https://cdn.biowasm.com)
* **Aioli**: a tool for running these modules in a browser, inside WebWorkers (i.e. background threads) &mdash; [repo](https://github.com/biowasm/aioli)


## Tools using biowasm

| Tool | URL | Repo |
|-|-|-|
| Ribbon | [genomeribbon.com](https://genomeribbon.com) | [MariaNattestad/Ribbon](https://github.com/MariaNattestad/Ribbon) |
| Alignment Sandbox | [alignment.sandbox.bio](https://alignment.sandbox.bio/) | [RobertAboukhalil/alignment-sandbox](https://github.com/robertaboukhalil/alignment-sandbox) |
| tSNE Sandbox | [tsne.sandbox.bio](https://tsne.sandbox.bio/) | [RobertAboukhalil/tsne-sandbox](https://github.com/robertaboukhalil/tsne-sandbox) |
| fastq.bio | [fastq.bio](http://www.fastq.bio/) | [RobertAboukhalil/fastq.bio](https://github.com/robertaboukhalil/fastq.bio) |
| bam.bio | [bam.bio](http://www.bam.bio/) | [RobertAboukhalil/bam.bio](https://github.com/robertaboukhalil/bam.bio) |


## Get Started

### Simple usage

To get started, here is some HTML code that runs the command `samtools view -q 20` on a sample SAM file and outputs the contents to screen:

```html
<script src="https://cdn.biowasm.com/aioli/latest/aioli.js"></script>
<script>
let samtools = new Aioli("samtools/1.10");

document.write("Loading...");
samtools
    // Initialize samtools
    .init()
    // Run "samtools view" command with "-q 20" filter
    .then(() => samtools.exec("view -q 20 /samtools/examples/toy.sam"))
    // Output result
    .then(d => document.write(`<pre>${d.stdout}\n${d.stderr}</pre>`));
</script>
```

The list of all modules available on the CDN are listed at [cdn.biowasm.com/index](https://cdn.biowasm.com/index). See the [Aioli repo](https://github.com/biowasm/aioli#getting-started) for more information on getting started.

### Usage without Aioli

It is not recommended, but is possible, to use biowasm modules without Aioli, but it requires using Emscripten's `Module` variable. For example, you can navigate to [/samtools/1.10/samtools.html](https://cdn.biowasm.com/samtools/1.10/samtools.html), open the Developer Console and type `Module.callMain(["view"])` to see the help menu for the `samtools view` command.

Here is the equivalent example from above, but without Aioli:

```html
<script>
var Module = {
    onRuntimeInitialized: () => {
        Module.callMain(["view", "-q", "20", "/samtools/examples/toy.sam"]);
    }
};
</script>
<script src="https://cdn.biowasm.com/samtools/1.10/samtools.js"></script>
```

Note that here we define the `Module` variable before loading the `samtools.js` file from the CDN, and that we use `callMain()` where the parameter is an array of values.

See the [Emscripten documentation](https://emscripten.org/docs/api_reference/module.html) for details.

---

## Contributing

Ignore the rest of this README if you are not contributing changes to the biowasm repo.

### Setup

Tools listed in biowasm were compiled to WebAssembly using `Emscripten 2.0.0`.

```bash
# Fetch Emscripten docker image
docker pull emscripten/emsdk:2.0.0

# Create the container and mount ~/wasm to /src in the container
docker run \
    -it -d \
    -p 80:80 \
    --name wasm \
    --volume ~/wasm:/src \
    emscripten/emsdk:2.0.0

# Go into the container
docker exec -u root -it wasm bash
# While inside the container, install dependencies
apt-get update
apt-get install -y autoconf liblzma-dev less vim
# Create small web server for testing
cat << EOF > server.py
import http.server
import socketserver

handler = http.server.SimpleHTTPRequestHandler
handler.extensions_map['.wasm'] = 'application/wasm'
httpd = socketserver.TCPServer(('', 80), handler)
httpd.serve_forever()
EOF
chmod +x server.py
# Launch the web server
python3.7 /src/server.py &
```


### Compile a tool

```bash
# Go into your container
docker exec -it wasm bash

# Compile seqtk
cd biowasm/
make init  # only need to do this once
make seqtk

# This will create tools/<tool name>/build with .js/.wasm files
ls tools/seqtk/build
```


### Add a new tool

First, add the tool as a git module:

```bash
# Fetch codebase
mkdir -p tools/seqtk
git submodule add https://github.com/lh3/seqtk.git tools/seqtk/src

# Get specific version of the tool
cd tools/seqtk/src
git checkout v1.3
cd -

# Stage changes for git
git add tools/seqtk/src .gitmodules
```

You should also create the following files:

```bash
tools/<tool>/
    README.md   Details about the tool and dependencies
    compile.sh  Script that will run to compile the tool to WebAssembly (can use `$EM_FLAGS` for common flags)
    patches/    
        <tag>   Patch applied to the code to compile it to WebAssembly; branch- or tag-specific (optional)
```

## Deploy changes

* Changes merged are auto-deployed via GitHub Actions to `cdn-stg.biowasm.com`.


## To do

- Deploy one tool without re-compiling all others: download data from the CDN onto the GitHub Actions VM first?
- Run each tool's tests: use Selenium? Can't use node.js when have `.data` files
- Generate HTML file for each tool: CLI for testing, predefined queries, etc
- Support for Rust bioinformatics tools such as [sourmash](https://github.com/dib-lab/sourmash/tree/v3.2.2/src/core) and [rust-bio](https://github.com/rust-bio/rust-bio)
