// app/api/upload-image/route.ts
import { Octokit } from "@octokit/rest";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
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
    // Verify authentication
    const supabase = createServerComponentClient({ cookies });
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

    // Validate folder
    if (folder !== "logos" && folder !== "covers") {
      return NextResponse.json(
        { error: 'Invalid folder. Must be either "logos" or "covers"' },
        { status: 400 }
      );
    }

    // Set up GitHub client
    const octokit = new Octokit({
      auth: GITHUB_TOKEN,
    });

    // File path in the repository
    const filePath = `${BASE_PATH}/${folder}/${fileName}`;

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
