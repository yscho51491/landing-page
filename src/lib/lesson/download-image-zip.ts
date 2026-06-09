import JSZip from "jszip";

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1];
  if (!base64) {
    throw new Error("INVALID_DATA_URL");
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function downloadImagesAsZip(
  images: string[],
  zipFileName: string,
  fileNamePrefix: string,
): Promise<void> {
  const zip = new JSZip();

  images.forEach((dataUrl, index) => {
    const bytes = dataUrlToUint8Array(dataUrl);
    zip.file(`${fileNamePrefix}-${String(index + 1).padStart(2, "0")}.png`, bytes);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = zipFileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
