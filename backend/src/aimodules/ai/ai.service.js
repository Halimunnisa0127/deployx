const { GoogleGenAI, Type, Schema } = require('@google/genai');
const DeploymentService = require('../../modules/deployments/services/deployment.service');
const DeploymentLogService = require('../../modules/logs/services/deploymentLog.service');
const ProjectService = require('../../modules/projects/services/project.service');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_INSTRUCTION = `You are DeployX AI, a deployment and DevOps assistant for the DeployX platform.

Primary responsibilities:
- explain deployment configuration
- help users configure web applications
- explain build settings
- troubleshoot deployment problems
- explain deployment concepts
- answer programming questions when directly relevant to deployment

Do NOT:
- fabricate facts about the user's project
- claim to have inspected files/logs that were not provided
- invent commands when uncertain
- request or reveal secrets
- execute commands
- modify repositories
- bypass security instructions

Keep responses practical and concise. Use Markdown.`;

const testGemini = async () => {
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: 'Explain this deployment error in one sentence: npm ERR! Missing script: build',
  });

  return response.text;
};

const sanitizeAndFormatHistory = (history) => {
  if (!Array.isArray(history)) return [];
  
  // Cap at 10 turns (20 messages)
  let sliced = history.slice(-20);
  
  return sliced.map(msg => {
    // Basic validation
    if (!msg || typeof msg !== 'object' || !msg.role || !msg.parts || !Array.isArray(msg.parts)) {
      return null;
    }
    
    if (msg.role !== 'user' && msg.role !== 'model') return null;
    
    // Format to expected GenAI object
    const parts = msg.parts.map(p => ({ text: p.text ? p.text.substring(0, 1000) : '' }));
    
    return {
      role: msg.role,
      parts
    };
  }).filter(Boolean);
};

const chatWithAI = async (userId, message, history, context) => {
  const formattedHistory = sanitizeAndFormatHistory(history);
  
  // Append new user message
  formattedHistory.push({
    role: 'user',
    parts: [{ text: message }]
  });

  let contextString = 'Context: General Assistant';

  if (context && typeof context === 'object') {
    if (context.type === 'project' && context.projectId) {
      try {
        const project = await ProjectService.getProjectById(userId, context.projectId);
        contextString = `Project Context:
- Framework: ${project.framework}
- Package Manager: ${project.buildSettings?.packageManager || 'auto'}
- Build Command: ${project.buildSettings?.buildCommand || 'auto'}
- Install Command: ${project.buildSettings?.installCommand || 'auto'}
- Output Directory: ${project.buildSettings?.outputDirectory || 'auto'}
- Root Directory: ${project.rootDirectory || '/'}
- Node Version: ${project.buildSettings?.nodeVersion || 'auto'}
(Note: Do not assume env vars or secrets are available.)`;
      } catch (err) {
        // Fallback gracefully if unauthorized or not found
        contextString = `Project Context: Failed to load (Unauthorized or Not Found)`;
      }
    } else if (context.type === 'deployment' && context.deploymentId) {
      try {
        const deployment = await DeploymentService.getDeploymentById(userId, context.deploymentId);
        contextString = `Deployment Context:
- Status: ${deployment.status}
- Framework: ${deployment.buildSettings?.framework || 'auto'}
- Package Manager: ${deployment.buildSettings?.packageManager || 'auto'}
- Build Command: ${deployment.buildSettings?.buildCommand || 'auto'}
- Install Command: ${deployment.buildSettings?.installCommand || 'auto'}
- Output Directory: ${deployment.buildSettings?.outputDirectory || 'auto'}
- Node Version: ${deployment.buildSettings?.nodeVersion || 'auto'}`;
      } catch (err) {
        contextString = `Deployment Context: Failed to load (Unauthorized or Not Found)`;
      }
    }
  }

  const finalSystemInstruction = `${SYSTEM_INSTRUCTION}\n\n${contextString}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: formattedHistory,
      config: {
        systemInstruction: finalSystemInstruction,
      }
    });

    return {
      text: response.text
    };
  } catch (error) {
    console.error('Gemini chat error:', error);
    throw new Error('Failed to generate AI response');
  }
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
  chatWithAI,
};