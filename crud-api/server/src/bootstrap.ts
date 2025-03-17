import dotenv from "dotenv";
import path from "path"; // Load the environment variables from the root .env.development file
const result = dotenv.config({
  path: path.resolve(__dirname, "../.env.development"),
}); // Now import the main application module
// Check if the .env file was loaded successfully
if (result.error) {
  console.error("Error loading .env.development file:", result.error);
  process.exit(1);
} else {
  // Optionally, log the loaded variables to diagnose (Be careful not to log sensitive data in production)
  console.log(
    "Bootstrap - loaded environment variables from .env.development:",
    result.parsed,
  );
  console.log("Bootstrap - starting application...");
}
import "./index";
