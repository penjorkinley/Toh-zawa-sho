// app/api/upload-image/route.ts (Updated to support menu-items)
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Octokit } from "@octokit/rest";
import { NextRequest, NextResponse } from "next/server";

// Configuration for GitHub repository
const GITHUB_REPO = process.env.GITHUB_REPO || "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const BRANCH = process.env.GITHUB_BRANCH || "main";

// Parse repo owner and name from GITHUB_REPO (format: owner/repo)
const [REPO_OWNER, REPO_NAME] = GITHUB_REPO.split("/");

// Base path for images in the repository
const BASE_PATH = "public/images";

export async function POST(request: NextRequest) {
  try {
    // UPDATED: Use new server client
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { fileName, folder, base64Content, contentType } = body;

    if (!fileName || !folder || !base64Content || !contentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate folder - Updated to include menu-items
    const validFolders = ["logos", "covers", "menu-items"];
    if (!validFolders.includes(folder)) {
      return NextResponse.json(
        { error: `Invalid folder. Must be one of: ${validFolders.join(", ")}` },
        { status: 400 }
      );
    }

    // Set up GitHub client
    const octokit = new Octokit({
      auth: GITHUB_TOKEN,
    });

    // File path in the repository
    const filePath = `${BASE_PATH}/${folder}/${fileName}`;

    try {
      // Upload file to GitHub
      const response = await octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: filePath,
        message: `Upload ${folder} image: ${fileName}`,
        content: base64Content,
        branch: BRANCH,
      });

      // Get the raw content URL
      const rawContentUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${filePath}`;

      return NextResponse.json({
        success: true,
        url: rawContentUrl,
        sha: response.data.content?.sha,
      });
    } catch (githubError) {
      console.error("GitHub API Error:", githubError);
      throw new Error("Failed to upload to GitHub repository");
    }
  } catch (error) {
    console.error("Error uploading to GitHub:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to upload image",
        success: false,
      },
      { status: 500 }
    );
  }
}
