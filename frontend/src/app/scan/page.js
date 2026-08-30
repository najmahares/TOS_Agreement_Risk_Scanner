"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createScan } from "../../lib/scans";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function ScanPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const validTypes = ["txt", "md", "csv", "rtf", "pdf", "docx"];

  async function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    const fileType = file.name.split(".").pop().toLowerCase();

    if (!validTypes.includes(fileType)) {
      setError(
        "Invalid format. Please upload a .txt, .md, .csv, .rtf, .pdf, or .docx file.",
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Please upload a file under 10MB.");
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    const isEXE = uint8[0] === 0x4d && uint8[1] === 0x5a;
    const isPDF =
      uint8[0] === 0x25 &&
      uint8[1] === 0x50 &&
      uint8[2] === 0x44 &&
      uint8[3] === 0x46;
    const isZIP = uint8[0] === 0x50 && uint8[1] === 0x4b;

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
      return;
    }

    try {
      let text = "";

      if (fileType === "pdf") {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const pageContent = await page.getTextContent();
          text += pageContent.items.map((item) => item.str).join(" ") + "\n";
        }
      } else if (fileType === "docx") {
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        text = new TextDecoder().decode(uint8);
      }

      setContent(text.trim());
      setFileName(file.name);
      setIsFileUploaded(true);

      if (!title.trim()) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }

      setError("");
    } catch (err) {
      setError(
        "Failed to extract text from file. Please try pasting it manually.",
      );
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const finalTitle = title.trim() || fileName.replace(/\.[^/.]+$/, "");

    if (!finalTitle) {
      setError("Please enter an agreement title or upload a file.");
      return;
    }

    if (content.trim().length < 12) {
      setError(
        "Please paste your agreement text or upload a file (at least 12 characters).",
      );
      return;
    }

    try {
      setLoading(true);
      const scan = await createScan(finalTitle, content);
      router.push(`/results/${scan.scan_id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="scan-page">
      <div className="container">
        <div className="scan-hero">
          <span className="scan-badge">
            🧬 Document intelligence for better review
          </span>
          <h1 className="scan-heading">
            Understand what you&apos;re agreeing to.
          </h1>
          <p className="scan-subtitle">
            Upload or paste a Terms of Service agreement for commercial apps
            like TikTok, YouTube, or Instagram to identify clauses that may
            deserve closer review.
          </p>
        </div>

        <div className="scan-card">
          <form onSubmit={handleSubmit}>
            <label className="scan-card-label" htmlFor="title">
              Agreement title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                fileName
                  ? fileName.replace(/\.[^/.]+$/, "")
                  : "e.g. TikTok Terms of Service"
              }
              disabled={loading}
            />

            <div style={{ marginTop: "var(--space-6)" }}>
              <label className="scan-card-label" htmlFor="content">
                Paste your agreement here
              </label>
              <p className="scan-card-helper">
                Your text is screened for contractual risk patterns, not legal
                validity.
              </p>

              {isFileUploaded ? (
                <div
                  className="card"
                  style={{
                    padding: "var(--space-4)",
                    textAlign: "center",
                    background: "var(--color-border-light)",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "var(--font-semibold)",
                      color: "var(--color-text)",
                    }}
                  >
                    ✅ Loaded: {fileName}
                  </p>
                  <p
                    className="text-muted text-sm"
                    style={{ marginTop: "var(--space-2)" }}
                  >
                    Content hidden for privacy. Click "Clear" if you want to
                    paste text instead.
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: "var(--space-4)" }}
                    onClick={() => {
                      setIsFileUploaded(false);
                      setContent("");
                      setFileName("");
                    }}
                  >
                    Clear Upload
                  </button>
                </div>
              ) : (
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste Terms of Service text..."
                  disabled={loading}
                />
              )}

              <div className="char-count">{content.length} characters</div>
            </div>

            <div
              className="scan-divider"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
                margin: "var(--space-6) 0",
              }}
            >
              <span
                style={{
                  flex: 1,
                  height: "1px",
                  background: "var(--color-border)",
                }}
              ></span>
              <span
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "var(--text-sm)",
                }}
              >
                OR
              </span>
              <span
                style={{
                  flex: 1,
                  height: "1px",
                  background: "var(--color-border)",
                }}
              ></span>
            </div>

            <label
              className="scan-upload"
              style={{
                flexDirection: "column",
                textAlign: "center",
                padding: "var(--space-8)",
                gap: "var(--space-3)",
              }}
            >
              <input
                type="file"
                accept=".txt,.md,.csv,.rtf,.pdf,.docx"
                onChange={handleFileUpload}
                disabled={loading}
                style={{ display: "none" }}
              />
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--color-primary)", margin: "0 auto" }}
              >
                <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
              </svg>
              <span className="scan-upload-text">
                {fileName
                  ? `Loaded: ${fileName}`
                  : "Click to Upload a document"}
              </span>
              <span className="scan-upload-sub">
                .txt, .pdf, .docx, .rtf, .md, .csv supported · Max size 10MB
              </span>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button
              type="submit"
              className="btn btn-primary scan-submit"
              disabled={loading}
            >
              {loading ? "Scanning Agreement..." : "Scan Agreement"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
