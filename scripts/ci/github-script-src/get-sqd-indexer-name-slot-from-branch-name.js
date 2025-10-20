/**
 *
 * @param github
 * @param context
 * @returns {Promise<string|*>}
 */
module.exports = async ({ github, context }) => {
  const { GITHUB_EVENT_NAME, GITHUB_REF, GITHUB_BASE_REF } = process.env;

  console.log("GITHUB_EVENT_NAME", GITHUB_EVENT_NAME);
  console.log("GITHUB_REF", GITHUB_REF);
  console.log("GITHUB_BASE_REF", GITHUB_BASE_REF);

  console.dir(context.payload.repository, { depth: null });
  console.log("------");
  console.dir(context.payload.repository.event, { depth: null });

  return JSON.stringify({ d: "test" });
};
