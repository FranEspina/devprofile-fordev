import { RequestHandler } from 'express';
export const ping: RequestHandler = async (req, res) => {
  res.status(200).send('pong')
}