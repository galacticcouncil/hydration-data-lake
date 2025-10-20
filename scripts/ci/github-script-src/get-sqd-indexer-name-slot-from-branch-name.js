/**
 *
 * @param github
 * @param context
 * @returns {Promise<string|*>}
 */
module.exports = async ({ github, context }) => {
  const {
    GITHUB_EVENT_NAME,
    GITHUB_REF,
    GITHUB_BASE_REF,
    VERSIONS_ROOT_FOLDER_NAME = "versions",
  } = process.env;

  let branchName = (GITHUB_REF || "").replace("refs/heads/", "");
  if (GITHUB_EVENT_NAME === "pull_request") {
    branchName = GITHUB_BASE_REF;
  }
  if (!branchName || branchName.length === 0) {
    throw new Error("Missing branch name");
  }

  const [folderName = "", indexerName = "", indexerSlot = ""] =
    branchName.split("/");

  if (folderName !== VERSIONS_ROOT_FOLDER_NAME)
    return { indexerName: "", indexerSlot: "" };

  return { indexerName, indexerSlot };
};
