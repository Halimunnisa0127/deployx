// Mock Dependencies
const mockGenerateContent = jest.fn().mockResolvedValue({ text: 'Mocked AI response' });

jest.mock('../../src/modules/projects/services/project.service');
jest.mock('../../src/modules/deployments/services/deployment.service');
jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: mockGenerateContent
        }
      };
    })
  };
});

const { chatWithAI } = require('../../src/aimodules/ai/ai.service');
const ProjectService = require('../../src/modules/projects/services/project.service');
const DeploymentService = require('../../src/modules/deployments/services/deployment.service');



describe('AI Chat Service (Unit)', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateContent.mockResolvedValue({ text: 'Mocked AI response' });
    
    
    // Default mocks
    ProjectService.getProjectById.mockResolvedValue({
      framework: 'react',
      rootDirectory: '/',
      buildSettings: {
        packageManager: 'npm',
        buildCommand: 'npm run build',
        installCommand: 'npm install',
        outputDirectory: 'dist',
        nodeVersion: '18'
      }
    });

    DeploymentService.getDeploymentById.mockResolvedValue({
      status: 'failed',
      buildSettings: {
        framework: 'vue',
      }
    });
  });

  it('should handle general chat correctly', async () => {
    const history = [{ role: 'user', parts: [{ text: 'Hello' }] }];
    const result = await chatWithAI('user123', 'How do I deploy?', history, { type: 'general' });
    
    expect(result.text).toBe('Mocked AI response');
    // Ensure generateContent was called with correct history mapping
    expect(mockGenerateContent).toHaveBeenCalled();
  });

  it('should sanitize history to maximum 20 messages (10 turns)', async () => {
    const history = Array(30).fill(null).map((_, i) => ({
      role: i % 2 === 0 ? 'user' : 'model',
      parts: [{ text: `Message ${i}` }]
    }));
    
    await chatWithAI('user123', 'New message', history, { type: 'general' });
    
    const callArgs = mockGenerateContent.mock.calls[0][0];
    // 20 from history + 1 new message = 21
    expect(callArgs.contents.length).toBe(21);
    expect(callArgs.contents[0].parts[0].text).toBe('Message 10'); // Because it sliced the last 20
  });

  it('should reject malformed history items', async () => {
    const history = [
      { invalid_role: 'admin', parts: [] },
      null,
      'string',
      { role: 'user', parts: [{ text: 'Valid' }] }
    ];
    
    await chatWithAI('user123', 'New message', history, { type: 'general' });
    
    const callArgs = mockGenerateContent.mock.calls[0][0];
    expect(callArgs.contents.length).toBe(2); // 1 valid history + 1 new
  });

  it('should truncate individual long messages to 1000 chars in history', async () => {
    const longText = 'A'.repeat(2000);
    const history = [{ role: 'user', parts: [{ text: longText }] }];
    
    await chatWithAI('user123', 'New message', history, { type: 'general' });
    
    const callArgs = mockGenerateContent.mock.calls[0][0];
    expect(callArgs.contents[0].parts[0].text.length).toBe(1000);
  });

  it('should fetch and inject project context if projectId is provided', async () => {
    await chatWithAI('user123', 'How do I configure this?', [], { type: 'project', projectId: 'proj123' });
    
    expect(ProjectService.getProjectById).toHaveBeenCalledWith('user123', 'proj123');
    
    const callArgs = mockGenerateContent.mock.calls[0][0];
    expect(callArgs.config.systemInstruction).toContain('Project Context:');
    expect(callArgs.config.systemInstruction).toContain('Framework: react');
  });

  it('should fallback gracefully if user does not own the project', async () => {
    ProjectService.getProjectById.mockRejectedValue(new Error('Unauthorized'));
    
    await chatWithAI('user123', 'How do I configure this?', [], { type: 'project', projectId: 'proj123' });
    
    const callArgs = mockGenerateContent.mock.calls[0][0];
    expect(callArgs.config.systemInstruction).toContain('Failed to load');
  });

  it('should fetch and inject deployment context if deploymentId is provided', async () => {
    await chatWithAI('user123', 'Why did it fail?', [], { type: 'deployment', deploymentId: 'dep123' });
    
    expect(DeploymentService.getDeploymentById).toHaveBeenCalledWith('user123', 'dep123');
    
    const callArgs = mockGenerateContent.mock.calls[0][0];
    expect(callArgs.config.systemInstruction).toContain('Deployment Context:');
    expect(callArgs.config.systemInstruction).toContain('Status: failed');
  });

  it('should safely handle Google API failures', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Google 429 Quota Exceeded'));
    
    await expect(
      chatWithAI('user123', 'Hello', [], { type: 'general' })
    ).rejects.toThrow('Failed to generate AI response');
  });
});
