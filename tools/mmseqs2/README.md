## MMseqs2 

 ### Warning

 MMseqs2 relies on SIMD instructions, which are not supported by default in browsers. To enable SIMD:

 * **Firefox**: Go to [about:config](about:config), search for `javascript.options.wasm_simd` and toggle to `true`.
 * **Chrome**: Go to [chrome://flags](chrome://flags), search for `WebAssembly SIMD support` and toggle to `Enabled`

 ### Usage

 ```html
<script src="https://cdn.biowasm.com/aioli/latest/aioli.js"></script>
<script>
let mmseqs = new Aioli({
    "module" : "mmseqs2",
    "program" : "mmseqs",
});

document.write("Loading...");
mmseqs
  .init()
  .then(_ => mmseqs.fs("writeFile", "test.fa", ">tr|A7TBS3|A7TBS3_NEMVE Predicted protein (Fragment) OS=Nematostella vectensis GN=v1g153959 PE=4 SV=1 Split=0\nVCIHTENQNQVSFYPFVLHEISVLIELTLGHLRYRLTDVPPQPNSQPDSATNYVWML\n>tr|Q8WWJ3|Q8WWJ3_HUMAN T cell surface glycoprotein CD6 isoform b OS=Homo sapiens GN=CD6 PE=4 SV=1 Split=0\nMWLFFGITGLLTAALSGHPSPAPPDQLNTSSAESELWEPGERLPVRLTNGSSSCSGTVEVRLEASWEPACGALWDSRAAEAVCRALGCGGAEAASQLAPPTPELPPPPAAGNTSVAANATLAGAPALLCSGAEWRLCEVVEHACRSDGRRARVTCAENRALRLVDGGGACAGRVEMLEHGEWGSVCDDTWDLEDAHVVCRQLGCGWAVQALPGLHFTPGRGPIHRDQVNCSGAEAYLWDCPGLPGQHYCGHKEDAGVVCSEHQSWRLTGGADRCEGQVEVHFRGVWNTVCDSEWYPSEAKVLCQSLGCGTAVERPKGLPHSLSGRMYYSCNGEELTLSNCSWRFNNSNLCSQSLAARVLCSASRSLHNLSTPEVPASVQTVTIESSVTVKIENKESRELMLLIPSIVLGILLLGSLIFIAFILLRIKGKYVFMLPIQVQAPPPEDSDSGSDSDYEHYDFSAQPPVALTTFYNSQRHRVTDEEVQQSRFQMPPLEEGLEELHASHIPTANPGHCITDPPSLGPQYHPRSNSESSTSSGEDYCNSPKSKLPPWNPQVFSSERSSFLEQPPNLELASTQPAFSGPPADDSSSTSSGEWYQNFQPPPQPPSEEQFGCPGSPSPQPDSTDNDDYDDISAA\n>tr|H6QJ35|H6QJ35_RICMA Peptide chain release factor 1 OS=Rickettsia massiliae str. AZT80 GN=prfA PE=3 SV=1 Split=0\nMRFSDNLAKILDKYENLGNKLSSGIMGDEFVKASKEYAELEDVVAKIKEYNKAKSELEEANNFKLEVGLDNATLEMIEDEIHTLENSLPKLERAVKIALLPKDDADSKSAIIEVRAGSGGEEAALFAAVLFNMYQRYAELKGWRFEILAISDTGIGGYKEASASIKGKDVFSKLKFESGVHRVQRVPETESQGRIHTSAATVAVLPEAEEVDIQIEDKDLRIDTYRASGAGGQHVNTTDSAVRITHIPTGITVALQDEKSQHKNKAKALKILRARIYEEERRKKEQERADSRRGQVGSGDRSERIRTYNFPQGRVSDHRINLTLYKIDEVVKNGQLDEFVEALIADDEAKKLLGIYSKNTA\n"))
  .then(_ => mmseqs.cat("test.fa"))
  .then(_ => mmseqs.exec("createdb test.fa test_db"))
  .then(_ => mmseqs.exec("prefilter test_db test_db pref_db -k 5"))
  .then(_ => mmseqs.exec("align test_db test_db pref_db aln_db"))
  .then(_ => mmseqs.exec("convertalis test_db test_db aln_db res.m8"))
  .then(_ => mmseqs.cat("res.m8"))
  .then(d => document.write(`<pre>${d}</pre>`));
</script>
```
