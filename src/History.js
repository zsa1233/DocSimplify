import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function History() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const fetchDocs = async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching history:", error.message);
      } else {
        setDocs(data);
      }
    };

    fetchDocs();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Document History</h1>
      {docs.length === 0 ? (
        <p>No documents found yet.</p>
      ) : (
        docs.map((doc) => (
          <div
            key={doc.id}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            <h3 style={{ color: "#3b82f6" }}>Original</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{doc.original_text}</p>
            <h3 style={{ color: "#10b981", marginTop: "1rem" }}>Simplified</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{doc.simplified_text}</p>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "1rem" }}>
              Saved on: {new Date(doc.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
