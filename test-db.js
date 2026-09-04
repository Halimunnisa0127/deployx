const mongoose = require('mongoose');
const Project = require('./backend/src/modules/projects/models/Project');
const Deployment = require('./backend/src/modules/deployments/models/Deployment');
const Domain = require('./backend/src/modules/domains/models/Domain');

require('dotenv').config({ path: './backend/.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const testSlug = process.argv[2] || process.env.TEST_SLUG || 'bridal-makeup-template';
  const baseDomain = process.env.APP_BASE_DOMAIN || 'deployx.app';
  const hostname = `${testSlug}.${baseDomain}`;

  const project = await Project.findOne({ slug: testSlug });
  console.log("Project by slug:", project ? { id: project._id, domainUrl: project.domainUrl, prodDep: project.productionDeployment } : null);
  
  const projectByUrl1 = await Project.findOne({ domainUrl: `https://${hostname}` });
  console.log("Project by https URL:", projectByUrl1 ? projectByUrl1.domainUrl : null);
  
  const projectByUrl2 = await Project.findOne({ domainUrl: hostname });
  console.log("Project by exact URL:", projectByUrl2 ? projectByUrl2.domainUrl : null);

  const deployment = await Deployment.findOne({ url: `https://${hostname}` });
  console.log("Deployment by https URL:", deployment ? { id: deployment._id, url: deployment.url, runtimePort: deployment.runtimePort, status: deployment.status } : null);
  
  process.exit(0);
}

run().catch(console.error);
