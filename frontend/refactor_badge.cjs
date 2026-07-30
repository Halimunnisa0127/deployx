const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(file => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.tsx') || file.endsWith('.ts')) {
             results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk('d:/mern stack full projects/deployx/frontend/src/features/admin', (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    if (content.includes('StatusBadge') || content.includes('DeploymentStatusBadge')) {
      content = content.replace(/import\s+(?:[A-Za-z0-9_]+)\s+from\s+['"].*?StatusBadge['"];?/g, 'import Badge from \'../../../../components/ui/Badge\';');
      content = content.replace(/<StatusBadge/g, '<Badge');
      content = content.replace(/<DeploymentStatusBadge/g, '<Badge');
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('Modified', file);
    }
  });
});
