module.exports = {
  apps: [
    {
      name: "JCWDOL-008-06", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8000806,
      },
      time: true,
    },
  ],
};
