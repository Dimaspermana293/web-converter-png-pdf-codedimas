import { useState } from "react";
import "./App.css";
import { PDFDocument } from "pdf-lib";

function App() {
  // use State
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloading, setDownloading] = useState(false);

  // Fungsi untuk handling file
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Fungsi untuk handling convert PNG ke PDF
  const convertImageToPdf = async () => {
    // kondisi harus upload file dulu!
    if (!file) {
      alert("Silahkan upload file dulu ya!");
      return;
    }

    // set loading
    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.create();
      const image = await pdfDoc.embedPng(arrayBuffer);
      const { width, height } = image;

      // buat halaman dari image menjadi pdf
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
      });

      // bikin url dari convert
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      console.error("Error konversi png ke pdf!", error);
    } finally {
      setLoading(false);
      setDownloading(false);
    }
  };

  // handling untuk link download URL
  const handleDownloadClick = () => {
    setDownloading(true);

    // delay
    setTimeout(() => {
      setDownloading(false);
    }, 1000);
  };

  return (
    <>
      <div className="flex flex-col">
        <h1 className="mb-3 bg-clip-text text-transparent font-bold text-6xl bg-gradient-to-r bg-opacity-5 from-[#491FE1] to-[#BC02B6]">
          PNG to PDF
        </h1>
        <p className="mb-10 font-medium">
          Konversi file PNG ke PDF dengan mudah.
        </p>
        <input
          onChange={handleFileChange}
          type="file"
          accept="image/*"
          className="p-10 border border-dashed rounded-xl mb-5"
        />

        <button
          onClick={convertImageToPdf}
          disabled={loading}
          className="border-none bg-gradient-to-r bg-opacity-5 from-[#491FE1] to-[#BC02B6]"
        >
          {loading ? "Sedang konversi" : "Convert to PDF"}
        </button>

        {/* Menampilkan link download URL */}
        {loading && <div className="loader"></div>}
        {downloadUrl && (
          <div className="mt-4">
            <a
              href={downloadUrl}
              download="konversi.pdf"
              onClick={handleDownloadClick}
              className=""
            >
              {downloading ? "Proses download..." : "Download PDF"}
            </a>
            {downloading && <div className="loader"></div>}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
