"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createScan } from "../lib/scans";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const MAX_TEXT_LENGTH = 200000;
const MAX_TITLE_LENGTH = 200;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ScanForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setFileName(file.name);

    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Please upload a file under 10MB.");
      setFileName("");
      return;
    }

    const fileType = file.name.split(".").pop().toLowerCase();
    const validTypes = ["txt", "md", "csv", "rtf", "pdf", "docx"];
    if (!validTypes.includes(fileType)) {
      setError(
        "Unsupported format. Please upload .txt, .md, .csv, .rtf, .pdf, or .docx.",
      );
      setFileName("");
      return;
    }

    const arrayBuffer = await file.arrayBuffer();

    // Security: Magic Byte checks
    const uint8 = new Uint8Array(arrayBuffer);
    const isPDF =
      uint8[0] === 0x25 &&
      uint8[1] === 0x50 &&
      uint8[2] === 0x44 &&
      uint8[3] === 0x46; // %PDF
    const isZIP = uint8[0] === 0x50 && uint8[1] === 0x4b; // PK (DOCX/EXE/ZIP)
    const isEXE = uint8[0] === 0x4d && uint8[1] === 0x5a; // MZ

    if (
      isEXE ||
      (!isPDF &&
        !isZIP &&
        fileType !== "txt" &&
        fileType !== "md" &&
        fileType !== "csv" &&
        fileType !== "rtf")
    ) {
      setError("Security error: This file is not a valid document.");
      setFileName("");
      return;
    }

    try {
      let extractedText = "";

      if (fileType === "pdf") {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          extractedText +=
            content.items.map((item) => item.str).join(" ") + "\n";
        }
      } else if (fileType === "docx") {
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      } else {
        extractedText = new TextDecoder().decode(uint8);
      }

      setText(extractedText.trim());
      if (!title.trim()) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    } catch (err) {
      setError(
        "Failed to extract text from file. Please try pasting it manually.",
      );
      setFileName("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const cleanTitle = title.trim();
    const cleanText = text.trim();

    if (!cleanTitle) {
      setError("Please enter an agreement title.");
      return;
    }
    if (cleanTitle.length > MAX_TITLE_LENGTH) {
      setError(`Title must be less than ${MAX_TITLE_LENGTH} characters.`);
      return;
    }
    if (!cleanText) {
      setError("Please paste the agreement text or upload a file.");
      return;
    }
    if (cleanText.length > MAX_TEXT_LENGTH) {
      setError(
        `Agreement text must be less than ${MAX_TEXT_LENGTH} characters.`,
      );
      return;
    }

    try {
      setLoading(true);
      const result = await createScan(cleanTitle, cleanText);
      if (!result?.scan_id) {
        throw new Error("The server did not return a scan ID.");
      }
      router.push(`/results/${encodeURIComponent(result.scan_id)}`);
    } catch (err) {
      setError(err?.message || "Unable to create the scan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="scan-card"
        style={{ maxWidth: "720px", margin: "0 auto" }}
      >
        <div style={{ marginBottom: "var(--space-4)" }}>
          <label htmlFor="title">Agreement title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={MAX_TITLE_LENGTH}
            placeholder="e.g. Terms of Service"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="agreement-text">Paste your agreement here</label>
          <p className="scan-card-helper">
            Your text is screened for contractual risk patterns, not legal
            validity.
          </p>
          <textarea
            id="agreement-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_TEXT_LENGTH}
            placeholder="Paste Terms of Service text..."
            rows={12}
            disabled={loading}
          />
          <div className="char-count">
            {text.length.toLocaleString()} characters
          </div>
        </div>

        <div className="divider scan-divider">OR</div>

        <label className="scan-upload" style={{ cursor: "pointer" }}>
          <input
            type="file"
            accept=".txt,.md,.csv,.rtf,.pdf,.docx"
            onChange={handleFileUpload}
            disabled={loading}
            style={{ display: "none" }}
          />
          <span className="scan-upload-icon">📂</span>
          <div>
            <div className="scan-upload-text">
              {fileName ? `Loaded: ${fileName}` : "Upload a document"}
            </div>
            <div className="scan-upload-sub">
              <span>.txt</span>, <span>.md</span>, <span>.csv</span>,{" "}
              <span>.rtf</span>, <span>.pdf</span>, <span>.docx</span> supported
              · Max size 10MB
            </div>
          </div>
        </label>

        {error && (
          <p
            style={{
              color: "var(--color-danger)",
              marginTop: "var(--space-4)",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary scan-submit"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Scan Agreement →"}
        </button>
      </div>
    </form>
  );
}
