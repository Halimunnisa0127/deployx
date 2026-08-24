const express = require('express');
const { testGemini, analyzeDeployment } = require('./ai.service');
const { authenticate } = require('../../middleware/auth.middleware');
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

router.post('/deployment/analyze', authenticate, async (req, res, next) => {
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

module.exports = router;