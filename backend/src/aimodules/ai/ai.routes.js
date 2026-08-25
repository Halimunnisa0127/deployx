const express = require('express');
const { testGemini, analyzeDeployment, chatWithAI } = require('./ai.service');
const { authenticate } = require('../../middleware/auth.middleware');
const { aiRateLimiter } = require('../../middleware/rateLimiter.middleware');
const ApiResponse = require('../../shared/responses/ApiResponse');

const router = express.Router();

router.get('/test', async (req, res) => {
  try {
    const result = await testGemini();

    res.json({
      success: true,
      message: result,
    });
  } catch (error) {
    console.error('Gemini test error:', error);

    res.status(500).json({
      success: false,
      message: 'Gemini API test failed',
    });
  }
});

router.post('/deployment/analyze', authenticate, aiRateLimiter, async (req, res, next) => {
  try {
    const { deploymentId } = req.body;
    
    if (!deploymentId) {
      return res.status(400).json(ApiResponse.error('deploymentId is required', {}, 400));
    }

    const userId = req.user.id;
    const analysis = await analyzeDeployment(userId, deploymentId);
    
    return res.json(ApiResponse.success('Deployment analyzed successfully', analysis));
  } catch (error) {
    console.error('Deployment AI analysis error:', error);
    next(error); // Let global error handler catch it
  }
});

router.post('/chat', authenticate, aiRateLimiter, async (req, res, next) => {
  try {
    const { message, history, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json(ApiResponse.error('Message string is required', {}, 400));
    }

    if (message.length > 1000) {
      return res.status(400).json(ApiResponse.error('Message is too long (max 1000 chars)', {}, 400));
    }

    if (!Array.isArray(history)) {
      return res.status(400).json(ApiResponse.error('History must be an array', {}, 400));
    }

    const userId = req.user.id;
    const responseData = await chatWithAI(userId, message, history, context);

    return res.json(ApiResponse.success('Chat response generated successfully', responseData));
  } catch (error) {
    console.error('AI chat error:', error);
    next(error);
  }
});

module.exports = router;