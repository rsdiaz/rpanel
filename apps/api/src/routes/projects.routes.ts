import express, { Router } from 'express';
import { ProjectManager } from '../core/ProjectManager';
import { DeployService } from '../core/DeployService';
import { ServiceTemplate } from '../types';

const router: Router = express.Router();
const projectManager = new ProjectManager()
const deployService = new DeployService()

router.get('/', async (req, res) => {
  console.log('listApps')
  const apps = projectManager.listApps();
  res.status(200).send(apps);
});

router.post('/', async (req, res) => {
  const { name, config } = req.body;

  const services = config.services

  console.log(config, 'config')

  const project = projectManager.createApp(name, config);

  if(services.length) {
    deployService.deploy(name, config)
  }

  res.json(project);
});

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const { name, config } = req.body;
  projectManager.updateApp(id, config)
  res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  projectManager.deleteApp(req.params.id);
  res.json({ ok: req.params.id });
});

router.post('/deploy', async (req, res) => {
  const { name, services } = req.body
  const template: ServiceTemplate = { services }

  console.log(template, 'template')

  deployService.deploy(name, template)

  res.json({ ok: true });
});

export default router;