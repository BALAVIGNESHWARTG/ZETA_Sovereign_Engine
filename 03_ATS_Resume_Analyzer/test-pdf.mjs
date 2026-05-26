import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { readFileSync } from 'fs';

console.log("getDocument:", typeof pdfjsLib.getDocument);

// Quick parse test with a real PDF if one exists
async function test() {
  try {
    // Create a minimal valid PDF buffer for testing
    const data = new Uint8Array([
      0x25, 0x50, 0x44, 0x46 // %PDF header
    ]);
    console.log("pdfjs-dist loaded successfully. getDocument:", typeof pdfjsLib.getDocument);
  } catch(e) {
    console.error(e);
  }
}
test();
