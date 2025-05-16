import React, { useState, useEffect } from "react";

function App() {
  const [translatedText, setTranslatedText] = useState("");
  const [originalText, setOriginalText] = useState("Upload a document to preview its contents here.");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [fileName, setFileName] = useState("");
  const [typedOutput, setTypedOutput] = useState("");

  const fakeSimplifiedText =
    "Simplified and AI-enhanced version of the document.";

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setFileName(file.name);

    setTimeout(() => {
      setOriginalText("Uploaded file content preview...\n\nThis would be the extracted text from the file.");
      setTranslatedText(fakeSimplifiedText);
      setLoading(false);
    }, 2000);
  };

  const downloadText = () => {
    const blob = new Blob([translatedText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "simplified.txt";
    link.click();
  };

  useEffect(() => {
    if (!loading && translatedText) {
      setTypedOutput("");
      let index = 0;
      const interval = setInterval(() => {
        if (index < translatedText.length) {
          setTypedOutput((prev) => prev + translatedText[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [translatedText, loading]);
  
  const styles = {
    page: {
      minHeight: "100vh",
      background: darkMode
        ? "linear-gradient(135deg, #0f0c29, #302b63, #24243e)"
        : "linear-gradient(135deg, #fdfbfb, #ebedee)",
      color: darkMode ? "#f0f0f0" : "#222",
      fontFamily: "'Segoe UI', Roboto, monospace",
      padding: "40px 20px",
      boxSizing: "border-box",
      transition: "background 0.4s ease",
    },
    navbar: {
      background: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0,0,0,0.05)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.1)",
      padding: "20px 40px",
      borderRadius: "16px",
      marginBottom: "40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      color: darkMode ? "#84d2f6" : "#1e3a8a",
    },
    toggleBtn: {
      background: darkMode ? "#fff" : "#111827",
      color: darkMode ? "#111827" : "#fff",
      border: "none",
      padding: "8px 14px",
      borderRadius: "8px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
    },
    heading: {
      fontSize: "48px",
      marginBottom: "10px",
    },
    tagline: {
      fontSize: "18px",
      color: darkMode ? "#ccc" : "#666",
    },
    card: {
      backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "#fff",
      padding: "24px",
      borderRadius: "16px",
      border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid #eee",
      width: "100%",
      maxWidth: "500px",
      minHeight: "200px",
      whiteSpace: "pre-wrap",
      overflowWrap: "break-word",
    },
    splitView: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "40px",
      marginTop: "30px",
    },
    uploadBox: {
      backgroundColor: darkMode ? "#1e1e2f" : "#f9f9f9",
      padding: "32px",
      borderRadius: "16px",
      textAlign: "center",
      maxWidth: "500px",
      margin: "0 auto",
      marginBottom: "40px",
      boxShadow: darkMode ? "0 0 10px #000" : "0 0 10px #ccc",
    },
    uploadLabel: {
      fontSize: "16px",
      color: darkMode ? "#84d2f6" : "#1e3a8a",
      fontWeight: "bold",
      marginBottom: "12px",
      display: "block",
    },
    uploadInput: { display: "none" },
    uploadButton: {
      padding: "12px 24px",
      background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
      color: "#fff",
      fontWeight: "bold",
      borderRadius: "8px",
      cursor: "pointer",
      border: "none",
      fontSize: "16px",
      transition: "transform 0.2s ease",
    },
    downloadButton: {
      marginTop: "20px",
      background: "#10b981",
      color: "#fff",
      fontWeight: "bold",
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
    },
    loadingSpinner: {
      marginTop: "20px",
      width: "30px",
      height: "30px",
      border: "4px solid #84d2f6",
      borderTop: "4px solid transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    highlight: {
      textDecoration: "line-through",
      color: darkMode ? "#f87171" : "#b91c1c",
      backgroundColor: darkMode ? "#1f2937" : "#fee2e2",
      padding: "0 4px",
      borderRadius: "4px",
    },
  };

  const renderWithHighlight = (text) =>
    text.split(/(~.*?~)/g).map((chunk, i) =>
      chunk.startsWith("~") && chunk.endsWith("~") ? (
        <span key={i} style={styles.highlight}>{chunk.replace(/~/g, "")}</span>
      ) : (
        <span key={i}>{chunk}</span>
      )
    );

  return (
    <div style={styles.page}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={styles.navbar}>
        <div style={styles.title}>DocSimplify AI</div>
        <button onClick={() => setDarkMode(!darkMode)} style={styles.toggleBtn}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div style={styles.header}>
        <h1 style={styles.heading}>Simplify Complex Documents using AI</h1>
        <p style={styles.tagline}>AI-powered clarity, right at your fingertips.</p>
      </div>

      <div style={styles.uploadBox}>
        <label style={styles.uploadLabel}>Upload a PDF or image:</label>
        <label style={styles.uploadButton}>
          Choose File
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} style={styles.uploadInput} />
        </label>
        {fileName && <p style={{ marginTop: "12px", fontSize: "14px" }}>Uploaded: {fileName}</p>}
        {loading && <div style={styles.loadingSpinner}></div>}
        {!loading && translatedText && (
          <button onClick={downloadText} style={styles.downloadButton}>Download Simplified Text</button>
        )}
      </div>

      <div style={styles.splitView}>
        <div style={styles.card}>
          <h3 style={{ color: "#60a5fa", marginBottom: "10px" }}>Original</h3>
          <p>{originalText}</p>
        </div>
        <div style={styles.card}>
          <h3 style={{ color: "#34d399", marginBottom: "10px" }}>Simplified</h3>
          <p>{typedOutput ? renderWithHighlight(typedOutput) : ""}</p>
        </div>
      </div>
    </div>
  );
}

export default App;

