"use client";

export default function FindingCard({ finding }) {
  const priority = finding.priority?.toLowerCase() || "review";
  const priorityLabel = priority.charAt(0).toUpperCase() + priority.slice(1);

  const getSnippet = (text) => {
    if (!text) return "";
    const cleanText = text.replace(/\s+/g, " ").trim();
    const sentence = cleanText.match(/[^.!?]+[.!?]/)?.[0]?.trim();
    if (sentence) {
      return sentence.length > 180
        ? `${sentence.slice(0, 177).trim()}...`
        : sentence;
    }
    return cleanText.length > 180
      ? `${cleanText.slice(0, 177).trim()}...`
      : cleanText;
  };

  const getFriendlyReason = () => {
    const category = finding.category;

    if (category === "TERMINATE_CONTRACT") {
      return "This clause gives the provider the right to cancel, suspend, or stop your access. Understand the conditions under which they make you  leave the platform.";
    }
    if (category === "REMOVE_CONTENT") {
      return "This clause allows the provider to delete or modify the content you post. They have broad rights over your material.";
    }
    if (category === "UNBALANCED_DELEGATION") {
      return "This clause gives one side a lot of control without giving you much say. It could leave you at a disadvantage.";
    }
    if (category === "OTHER") {
      return "This clause doesn't fit neatly into a specific risk box, but it contains terms you should read closely to avoid surprises.";
    }
    if (category === "FAIR") {
      return "This is generally standard practice, but it's always good to stay informed about what you're agreeing to.";
    }

    return (
      finding.reason ||
      "This clause contains language that may require closer inspection."
    );
  };

  return (
    <article className={`finding-card finding-${priority}`}>
      <div className="finding-card-top">
        <div className="finding-card-meta">
          <span className={`finding-priority-badge ${priority}`}>
            {priorityLabel}
          </span>
          {finding.category && (
            <span className="finding-category-badge">{finding.category}</span>
          )}
        </div>
        <span className="finding-clause-number">
          Clause {finding.clause_number}
        </span>
      </div>

      <div className="finding-snippet">
        <p>“{getSnippet(finding.text)}”</p>
      </div>

      <div className="finding-why">
        <div className="finding-why-heading">
          <span className="finding-why-icon">!</span>
          <span>Why this was flagged</span>
        </div>
        <p>{getFriendlyReason()}</p>
      </div>
    </article>
  );
}
