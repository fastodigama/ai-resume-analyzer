export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) {
    console.log("PDF.js already loaded");
    return pdfjsLib;
  }
  if (loadPromise) {
    console.log("PDF.js load already in progress");
    return loadPromise;
  }

  isLoading = true;
  console.log("Loading PDF.js library and worker...");

  // Load both the main library and the worker URL in parallel
  loadPromise = Promise.all([
    // @ts-expect-error - pdfjs-dist types might differ slightly
    import("pdfjs-dist/build/pdf.mjs"),
    // worker URL import with ?url to resolve the worker path from node_modules
    import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
  ]).then(([lib, workerUrlMod]) => {
    console.log("PDF.js library imported successfully");

    // CRITICAL FIX: Use the worker URL resolved from node_modules, not a static string
    lib.GlobalWorkerOptions.workerSrc = workerUrlMod.default;

    pdfjsLib = lib;
    isLoading = false;
    return lib;
  });

  return loadPromise;
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    console.log("Starting PDF → Image conversion for:", file.name);

    const lib = await loadPdfJs();
    console.log("Using pdfjsLib version:", lib.version);

    const arrayBuffer = await file.arrayBuffer();
    console.log("ArrayBuffer length:", arrayBuffer.byteLength);

    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    console.log("PDF loaded, total pages:", pdf.numPages);

    const page = await pdf.getPage(1);
    console.log("Got page 1");

    const viewport = page.getViewport({ scale: 4 });
    console.log("Viewport dimensions:", viewport.width, "x", viewport.height);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (context) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      console.log("Canvas context initialized with smoothing");
    } else {
      console.error("Canvas context is null!");
    }

    await page.render({ canvasContext: context!, viewport }).promise;
    console.log("Page rendered to canvas");

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log("Canvas converted to Blob successfully");
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            console.error("Failed to create image blob");
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob",
            });
          }
        },
        "image/png",
        1.0
      );
    });
  } catch (err) {
    console.error("PDF conversion error:", err);
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${err}`,
    };
  }
}