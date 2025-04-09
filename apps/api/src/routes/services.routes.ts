import express, { Router } from 'express';
import { DeployService } from '../core/DeployService';

const router: Router = express.Router();
const deployService = new DeployService()

// Obtener estado de un servicio
router.get('/:name/status', async (req, res) => {
  const status = await deployService.getServiceStatus(req.params.name);
  res.json({ status });
});

// Parar servicio
router.post('/:name/stop', async (req, res) => {
  await deployService.stopService(req.params.name);
  res.json({ ok: true });
});

// Iniciar servicio
router.post('/:name/start', async (req, res) => {
  await deployService.startService(req.params.name);
  res.json({ ok: true });
});

router.post('/:name/restart', async (req, res) => {
  await deployService.stopService(req.params.name);
  await deployService.startService(req.params.name);
  res.json({ ok: true });
});

export default router;