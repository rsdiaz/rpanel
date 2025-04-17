import express, { Router } from 'express';
import { ProjectManager } from '../core/ProjectManager';
import { DeployService } from '../core/DeployService';
import { ServiceTemplate } from '../types';

const router: Router = express.Router();
const projectManager = new ProjectManager()
const deployService = new DeployService()

router.get('/', (req, res) => {
  const apps = projectManager.listApps();
  res.json(apps);
});

router.post('/', async (req, res) => {
  const { name, config } = req.body;

  const services = config.services

  console.log(services)

  projectManager.createApp(name, config);

  if(services.length) {
    deployService.deploy(name, services)
  }


  res.json({ ok: true });
});

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const { name, config } = req.body;
  projectManager.updateApp(id, config)
  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  projectManager.deleteApp(req.params.id);
  res.json({ ok: true });
});

router.post('/deploy', async (req, res) => {
  const template = req.body as ServiceTemplate;

  deployService.deploy('test', template)

  res.json({ ok: true });
});

export default router;