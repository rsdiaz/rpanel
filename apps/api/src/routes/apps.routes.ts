import express, { Router } from 'express';
import { AppManager } from '../core/AppManager';
import { DeployService } from '../core/DeployService';
import { ServiceTemplate } from '../types';

const router: Router = express.Router();
const appManager = new AppManager()
const deployService = new DeployService()

router.get('/', (req, res) => {
  const apps = appManager.listApps();
  res.json(apps);
});

router.post('/', async (req, res) => {
  const { id, name, config } = req.body;
  appManager.createApp(id, name, config);
  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  appManager.deleteApp(req.params.id);
  res.json({ ok: true });
});

router.post('/deploy', async (req, res) => {
  const template = req.body as ServiceTemplate;

  for (const service of template.services) {
    const { serviceName, source, env, mounts } = service.data;

    if (mounts) {
      for (const m of mounts) {
        if (m.type === 'volume') {
          await deployService.createVolume(m.name);
        }
      }
    }

    const envList = env.split('\n').filter(Boolean);

    await deployService.createService(serviceName, {
      image: source.image,
      env: envList,
      mounts
    });
  }

  res.json({ ok: true });
});

export default router;