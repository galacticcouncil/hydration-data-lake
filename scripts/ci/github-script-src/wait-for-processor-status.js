const apiUtils = require("./utils/github-api");

const query = `
  query {
    _squidStatus {
      height
    }
  }
`;

/**
 *
 * @param github
 * @param context
 * @returns {Promise<string|*>}
 */
module.exports = async ({ github, context }) => {
  const { PROCESS_FROM_BLOCK, PROCESS_TO_BLOCK, PROCESSOR_API_URL } = process.env;

  const [owner, repo] = context.payload.repository.full_name.split("/");

  const getProcessorStatus = async () => {
    try {
      const response = await fetch(PROCESSOR_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return data.data._squidStatus[0].height;
      } else {
        console.error("GraphQL error:", data.errors);
        return 0;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      return 0;
    }
  };

  let waitingStatus = {
    finished: await new Promise(async (res, rej) => {
      let attemptsCount = 0;
      const interval = setInterval(async () => {
        const currentBlockHeight = await getProcessorStatus();
        console.log("currentBlockHeight - ", currentBlockHeight);
        console.log("attemptsCount - ", attemptsCount);
        if (currentBlockHeight >= PROCESS_TO_BLOCK) {
          clearInterval(interval);
          res(true);
          return;
        }
        if (attemptsCount > 130) {
          clearInterval(interval);
          rej(false);
          return;
        }
        attemptsCount++;
      }, 5000);
    }),
  };

  // return JSON.stringify(waitingStatus);
  return waitingStatus;
};
