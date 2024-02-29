import { Request, Response } from 'express'
import { getResourcesByUser } from '../services/db'

export async function getUserResources(req: Request, res: Response) {
  const id = Number(req.params.id);

  const resources = await getResourcesByUser(id)



  return res.status(200).json(resources)
}