const { GoogleGenAI, Type, Schema } = require('@google/genai');
const DeploymentService = require('../../modules/deployments/services/deployment.service');
const DeploymentLogService = require('../../modules/logs/services/deploymentLog.service');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const testGemini = async () => {
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: 'Explain this deployment error in one sentence: npm ERR! Missing script: build',
  });

  return response.text;
};

const analyzeDeployment = async (userId, deploymentId) => {
  // 1. Get deployment and verify ownership
  const deployment = await DeploymentService.getDeploymentById(userId, deploymentId);
  
  if (!deployment) {
    throw new Error('Deployment not found');
  }

  // 2. Fetch logs
  const logData = await DeploymentLogService.getDeploymentLogs(deploymentId, 1, 1000);
  const logs = logData.logs;

  if (!logs || logs.length === 0) {
    throw new Error('No logs found for this deployment');
  }

  // 3. Process and filter logs
  // Prioritize error logs and the last 100 lines for context
  const errorLogs = logs.filter(l => l.level === 'error').map(l => l.message);
  const recentLogs = logs.slice(-100).map(l => l.message);
  
  const logContext = `
RECENT LOGS:
${recentLogs.join('\n')}

ERROR LOGS:
${errorLogs.join('\n')}
  `;

  // 4. Truncate logs if too large (approx limit)
  const truncatedLogContext = logContext.substring(0, 15000);

  // 5. Build prompt with deployment context
  const prompt = `
You are an expert DevOps engineer and AI Deployment Debugging Assistant for DeployX.
Analyze the following deployment failure and provide a structured JSON response.

Deployment Context:
- Framework: ${deployment.buildSettings?.framework || 'auto'}
- Node Version: ${deployment.buildSettings?.nodeVersion || 'auto'}
- Package Manager: ${deployment.buildSettings?.packageManager || 'npm'}
- Build Command: ${deployment.buildSettings?.buildCommand || 'npm run build'}
- Install Command: ${deployment.buildSettings?.installCommand || 'npm install'}

Logs:
${truncatedLogContext}

Provide your analysis strictly in the requested JSON format.
  `;

  // 6. Call Gemini
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.STRING,
            description: "Short explanation of the deployment failure"
          },
          rootCause: {
            type: Type.STRING,
            description: "The actual likely root cause"
          },
          explanation: {
            type: Type.STRING,
            description: "Why this caused the deployment to fail"
          },
          severity: {
            type: Type.STRING,
            description: "low, medium, high, or critical"
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence score from 0.0 to 1.0"
          },
          fix: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Step-by-step instructions to fix the issue"
          },
          commands: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Suggested terminal commands to run"
          },
          filesToCheck: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Files that might contain the error"
          },
          shouldRedeploy: {
            type: Type.BOOLEAN,
            description: "Whether the user should trigger a redeploy after fixing"
          }
        },
        required: ["summary", "rootCause", "explanation", "severity", "confidence", "fix", "commands", "filesToCheck", "shouldRedeploy"]
      }
    }
  });

  // 7. Parse and return
  try {
    const jsonResult = JSON.parse(response.text);
    return jsonResult;
  } catch (error) {
    console.error('Failed to parse Gemini JSON response:', response.text);
    throw new Error('Invalid JSON response from AI');
  }
};

module.exports = {
  testGemini,
  analyzeDeployment,
};