import { describe, expect, it } from "vitest";
import { extractSummaryFromResponse } from "@/app/api/summarize/route";

describe("extractSummaryFromResponse", () => {
  it("extracts a summary from the standard Sarvam chat completion shape", () => {
    const result = extractSummaryFromResponse({
      choices: [
        {
          message: {
            content: "A concise summary",
          },
        },
      ],
    });

    expect(result).toBe("A concise summary");
  });

  it("extracts a summary from an alternate content shape", () => {
    const result = extractSummaryFromResponse({
      choices: [
        {
          message: {
            content: [
              {
                type: "text",
                text: "Alternate summary",
              },
            ],
          },
        },
      ],
    });

    expect(result).toBe("Alternate summary");
  });

  it("returns null when no summary content is available", () => {
    const result = extractSummaryFromResponse({
      choices: [
        {
          message: {
            content: "",
          },
        },
      ],
    });

    expect(result).toBeNull();
  });
});
